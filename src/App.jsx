/* eslint-disable no-unused-vars */
import "./App.css";
import { useState } from "react";
import CarMap from "./components/CarMap";
import Footer from "./components/Footer";

function App() {
  const [stopBus, setStopBus] = useState(true);
  const [notification, setNotification] = useState(false);
  const [isUserLocationActive, setIsUserLocationActive] = useState(false);
  const [routePass, setRoutePass] = useState(null);

  if(notification) {
    Notification.requestPermission().then(function (permission) {
      // Si el usuario nos lo concede, creamos la notificación
      console.log("Permisos asignados")
    });
  }

  const checkedNotification = () => {
    if (isUserLocationActive && !notification) {
      setNotification(true);
      console.log("Notificación activada");
    } else {
      setNotification(false);
      console.log("Notificación desactivada");
    }
  };

  const placeUniversity = [
    {
      lat: -12.055,
      lng: -77.084,
      name: "Comedor Universitario",
    },
    {
      lat: -12.056,
      lng: -77.086,
      name: "Residencia estudiantil",
    },
    {
      lat: -12.053167542053973,
      lng: -77.08550981820713,
      name: "Facultad de Ingeniería de Sistemas e Informática",
    },
    {
      lat: -12.059,
      lng: -77.082,
      name: "Facultad de Derecho y Ciencia Política",
    },
    {
      lat: -12.057970170536304, 
      lng: -77.08167127517723,
      name: "Facultad de Ciencias Sociales",
    },
    {
      lat: -12.054658536301693, 
      lng: -77.08478730443596,
      name: "Facultad de Educación",
    },
    {
      lat: -12.062,
      lng: -77.079,
      name: "Facultad de Ciencias Biológicas",
    },
    {
      lat: -12.05806480775423, 
      lng: -77.08113355117024,
      name: "Facultad de Ciencias Económicas",
    },
    {
      lat: -12.053985941032643, 
      lng: -77.08607844651438,
      name: "Facultad de Odontología",
    },
    {
      lat: -12.05355424310825, 
      lng: -77.0871733233459,
      name: "Facultad de Psicología",
    },
  ];

  return (
    <>
      {/* Menu de busqueda */}
      <div>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />

          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {placeUniversity.map((place, index) => (
                <li key={index}>
                  <a onClick={
                    () => {
                      setRoutePass([place.lat, place.lng]);
                    }
                  }>{place.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Mapa total */}
      <div className="flex flex-col h-dvh">
        <div className="flex-1 w-screen bg-base-100 relative flex flex-col lg:flex-row items-center justify-center lg:gap-5 lg:p-16">
          {/* Mapa */}
          <CarMap
            stopBus={stopBus}
            setStopBus={setStopBus}
            notification={notification}
            setNotification={setNotification}
            isUserLocationActive={isUserLocationActive}
            setIsUserLocationActive={setIsUserLocationActive}
            routePass={routePass}
            setRoutePass={setRoutePass}
          />
          {/* Extra */}
          <div className="collapse lg:hidden bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title  m-0 p-0 max-h-5 h-5 ">
              <div className="flex justify-center items-center w-full h-full">
                <div className="w-2/5 h-1 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="collapse-content ">
              <div className="lg:w-full lg:h-full flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text pr-3">
                        Notificarme cuando el bus se acerque
                      </span>
                      <input
                        type="checkbox"
                        checked={notification}
                        onChange={checkedNotification}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>
                  {/* 
                  <div className="flex gap-5 lg:gap-2 lg:flex-col">
                    <span className="text-md font-bold">Próxima parada:</span>
                    <span className="font-semibold">
                      Residencia estudiantil
                    </span>
                  </div>
                  <img
                    src="https://picsum.photos/200/100"
                    alt=""
                    className="rounded w-full"
                  />*/}
                </div>
              </div>
            </div>
          </div>
          {/* Extra lg screen */}
          <div className="w-1/3 h-full hidden lg:flex flex-col justify-between p-10 bg-base-300 rounded-xl">
            <div className="justify-between flex">
              <span className="text-md font-bold">Estado del bus:</span>
              <span
                className={`font-semibold ${
                  stopBus ? "text-red-700" : "text-green-700"
                }`}
              >
                {stopBus ? "Detenido" : "En curso"}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text pr-3">
                    Notificarme cuando el bus se acerque
                  </span>
                  <input
                    type="checkbox"
                    checked={notification}
                    onChange={checkedNotification}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              {/* 
                  <div className="flex gap-5 lg:gap-2 lg:flex-col">
                    <span className="text-md font-bold">Próxima parada:</span>
                    <span className="font-semibold">
                      Residencia estudiantil
                    </span>
                  </div>
                  <img
                    src="https://picsum.photos/200/100"
                    alt=""
                    className="rounded w-full"
                  />*/}
            </div>
            {/* 
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button w-full"
              >
                ¿Te perdiste?
              </label>
            </div>
            */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
