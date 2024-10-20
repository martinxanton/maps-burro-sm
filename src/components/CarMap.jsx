import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Fab from "./Fab";
import Toast from "./Toast";

const placeUniversity = [
  {
    name: "Comedor principal",
    lat: -12.059311510728927,
    long: -77.08310943612842,
  },
  {
    name: "Edificio S",
    lat: 14.6043,
    long: -90.4895,
  },
  {
    name: "Edificio T",
    lat: 14.6043,
    long: -90.4895,
  },
];

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

// Restrict the map to the San Marcos University
const bounds = [
  [-12.062, -77.089],
  [-12.051, -77.079],
];

// eslint-disable-next-line react/prop-types
const CarMap = ({ stopBus, setStopBus }) => {
  const [carData, setCarData] = useState(null);
  const [carPosition, setCarPosition] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [isUserLocationActive, setIsUserLocationActive] = useState(false);
  const [center, setCenter] = useState([-12.0555083, -77.08777]);
  const [followCar, setFollowCar] = useState(false);

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
        if (followCar) {
          console.log("Centrar en el bus activado");
          setCenter([data.latitude, data.longitude]);
        }
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchCarData();

    const interval = setInterval(fetchCarData, 100); // Actualiza la posición del carro cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  // Función para verificar si el usuario está dentro del radio
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
          setUserPosition(userPos);
          setIsUserLocationActive(true);
          const radius = 1000; // Radio de 1 km
          checkIfWithinRadius(
            carPosition,
            [placeUniversity[0].lat, placeUniversity[0].long],
            radius
          );
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
      if (followCar) {
        setFollowCar(false);
        console.log("Dejar de seguir al bus");
      } else {
        setFollowCar(true);
        setCenter(carPosition);
        console.log("Seguir al bus");
      }
    }
  };

  // Función para centrar el mapa en la posición del usuario
  const recenterToUser = () => {
    console.log("centrar al usuario");
    if (isUserLocationActive && userPosition) {
      setCenter(userPosition); // Actualiza el estado "center" con la posición del usuario
    }
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
      ></Fab>
      {/* Botón para activar la geolocalización y centrar el mapa */}
      <Fab
        onClick={!isUserLocationActive ? activateUserLocation : recenterToUser}
        className="absolute bottom-4 right-3.5 z-30"
        icon={!isUserLocationActive ? "near_me" : "person_pin"}
      ></Fab>
      {/* Alerta 
      <div className="absolute z-20 bottom-5 w-full">
        <Toast
          text="El bus se encuentra cerca"
          icon="info"
          className={"mx-auto"}
          isHidden={true}
        ></Toast>
      </div>*/}
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
              <br />
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
        {/* Reubica la vista según el estado "center" */}
        {center && <RecenterView lat={center[0]} lng={center[1]} />}
      </MapContainer>
    </div>
  );
};

export default CarMap;
