/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Fab from "./Fab";
import Toast from "./Toast";
import PropTypes from 'prop-types';
import RoutingMachine from "./RoutingMachine";



// eslint-disable-next-line react/prop-types
const RecenterView = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 55); // Cambia la vista del mapa a las coordenadas especificadas
    }
  }, [lat, lng, map]);
  return null;
};

// Limite de mapa de San Marcos (dentro de la universidad)
const bounds = [
  [-12.062, -77.089],
  [-12.051, -77.079],
];

const CarMap = ({
  stopBus,
  setStopBus,
  notification,
  setNotification,
  isUserLocationActive,
  setIsUserLocationActive,
  routePass,
}) => {
  const [carData, setCarData] = useState(null); // Datos del bus
  const [carPosition, setCarPosition] = useState(null); // Posición del bus
  const [userPosition, setUserPosition] = useState(null); // Posición del usuario
  const [center, setCenter] = useState(null); // Centro del mapa
  const [followCar, setFollowCar] = useState(false); // Seguir al bus
  const [toast, setToast] = useState({
    visible: false,
    text: "",
    icon: "",
    color: "",
  }); // Estado del toast

  console.log(routePass);

  const showToast = (text, icon, color) => {
    setToast({
      visible: true,
      text,
      icon,
      color,
    });
  };


  // Íconos personalizados

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448612.png",
    iconSize: [42, 42],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const carIcon = L.icon({
    iconUrl: stopBus
      ? "https://cdn-icons-png.flaticon.com/128/3448/3448339.png"
      : "https://cdn-icons-png.flaticon.com/128/3448/3448314.png",
    iconSize: [42, 42],
    iconAnchor: [16, 32],
    popupAnchor: [0, -16],
  });

  

  // Obtener la información del carro desde la API
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(
          "https://maps-burro-sm-backend.onrender.com/api/car-data"
        );
        const data = response.data;
        setCarData(data);
        setCarPosition([data.latitude, data.longitude]);
        if (data.speed === 0) {
          setStopBus(true);
        } else {
          setStopBus(false);
        }
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchCarData();

    const interval = setInterval(fetchCarData, 100); // Actualiza la posición del carro cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (followCar && carPosition) {
      setCenter(carPosition);
    }
  }, [followCar, carPosition]);

  useEffect(() => {
    if (isUserLocationActive && carPosition && userPosition && notification) {
      checkIfWithinRadius(carPosition, userPosition, 100); // Verifica si el usuario está dentro del radio del carro
    }
  }, [
    carPosition,
    checkIfWithinRadius,
    userPosition,
    notification,
    isUserLocationActive,
  ]);

  // Función para verificar si el usuario está dentro del radio del carro
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function checkIfWithinRadius(carPosition, userPosition, radius) {
    const carLatLng = L.latLng(carPosition[0], carPosition[1]);
    const userLatLng = L.latLng(userPosition[0], userPosition[1]);

    const distance = carLatLng.distanceTo(userLatLng); // Distancia en metros

    if (distance <= radius) {
      console.log(
        `El usuario está dentro del radio de ${
          radius / 1000
        } km (${distance.toFixed(2)} m) del carro.`
      );
      if (!toast.visible) {
        showToast(
          "¡El bus se encuentra cerca a ti!",
          "notifications",
          "bg-green-500"
        );
        setNotification(false);
        if (!("Notification" in window)) {
          alert(
            "Este navegador no es compatible con las notificaciones de escritorio",
          );
        }
      
        // Comprobamos si los permisos han sido concedidos anteriormente
        else if (Notification.permission === "granted") {
          // Si es correcto, lanzamos una notificación
          var notification = new Notification("¡El bus se encuentra cerca a ti!");
        }
      
        // Si no, pedimos permiso para la notificación
        else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            // Si el usuario nos lo concede, creamos la notificación
            if (permission === "granted") {
              var notification = new Notification("¡El bus se encuentra cerca a ti!");
            }
          });
        }
      }
    } else {
      console.log(
        `El usuario está fuera del radio de ${
          radius / 1000
        } km (${distance.toFixed(2)} m) del carro.`
      );
    }
  }

  // Función para activar la geolocalización del usuario
  const activateUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = [position.coords.latitude, position.coords.longitude];
          if (!isInsideUniversity(userPos[0], userPos[1])) {
            if (!toast.visible) {
              showToast(
                "Ups! estás fuera de la universidad",
                "warning",
                "bg-red-500"
              );
            }
            return;
          }
          setUserPosition(userPos);
          setIsUserLocationActive(true);
        },
        (error) => {
          console.error("Error al obtener la ubicación del usuario", error);
        }
      );
    } else {
      console.error("Geolocalización no soportada por el navegador");
    }
  };

  // Función para centrar el mapa en la posición del carro
  const recenterToCar = () => {
    console.log("centrar al bus");
    if (carPosition) {
      followCar ? setFollowCar(false) : setFollowCar(true);
      setCenter(carPosition);
    }
  };

  // Función para saber si la posicion está dentro de la universidad
  const isInsideUniversity = (lat, long) => {
    const result =
      lat >= bounds[0][0] &&
      lat <= bounds[1][0] &&
      long >= bounds[0][1] &&
      long <= bounds[1][1];
    console.log("Dentro de la universidad: ", result);
    return result;
  };

  // Función para centrar el mapa en la posición del usuario
  const recenterToUser = () => {
    if (isUserLocationActive && userPosition) {
      setCenter(userPosition); // Actualiza el estado "center" con la posición del usuario
    }
  };

  // Funcion para el set del toast
  const onDeleteToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className="relative w-full h-full max-h-full max-w-full">
      {/* Indicador de estado del bus */}
      <div
        className={`lg:hidden absolute rounded-full p-3 cursor-none select-none top-5 right-5 z-20 ${
          stopBus ? "bg-red-700" : "bg-green-700"
        }`}
      >
        <span className={`font-semibold text-sm lg:static text-white`}>
          {stopBus ? "Detenido" : "En curso"}
        </span>
      </div>
      {/* Botón para centrar al bus */}
      <Fab
        onClick={recenterToCar}
        className="absolute bottom-4 left-3.5 z-30"
        icon={"directions_bus"}
        isActive={followCar}
      ></Fab>
      {/* Botón para activar la geolocalización y centrar el mapa */}
      <Fab
        onClick={!isUserLocationActive ? activateUserLocation : recenterToUser}
        className="absolute bottom-4 right-3.5 z-30"
        icon={!isUserLocationActive ? "near_me_disabled" : "person_pin"}
      ></Fab>
      {/* Alerta */}
      {toast.visible && (
        <Toast
          text={toast.text}
          icon={toast.icon}
          color={toast.color}
          className="bottom-5"
          onDelete={onDeleteToast}
        />
      )}
      {/* Mapa */}
      <MapContainer
        center={center}
        bounds={bounds}
        maxBounds={bounds}
        bounceAtZoomLimits={true}
        minZoom={16}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg shadow-lg z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {carData && (
          <Marker position={carPosition} icon={carIcon}>
            <Popup>
              <b>Velocidad:</b> {carData.speed.toFixed(2)} km/h
            </Popup>
          </Marker>
        )}
        {/* Marcador del usuario (solo si se activó la geolocalización) */}
        {isUserLocationActive && userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>
              <b>Tu ubicación actual</b>
            </Popup>
          </Marker>
        )}
        {
          routePass && <RoutingMachine from={routePass} to={[-12.057107453321011, -77.079942455595]} />
        }
        {/* Reubica la vista según el estado "center" */}
        {center && <RecenterView lat={center[0]} lng={center[1]} />}
      </MapContainer>
    </div>
  );
};

CarMap.propTypes = {
  stopBus: PropTypes.bool,
  setStopBus: PropTypes.func,
  notification: PropTypes.bool,
  setNotification: PropTypes.func,
  isUserLocationActive: PropTypes.bool,
  setIsUserLocationActive: PropTypes.func,
  routePass: PropTypes.array,
};

export default CarMap;
