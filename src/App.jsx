import "./App.css";
import { useState } from "react";
import CarMap from "./components/CarMap";
import Footer from "./components/Footer";

function App() {
  const [stopBus, setStopBus] = useState(true);
  const [notification, setNotification] = useState(false);
  const [isUserLocationActive, setIsUserLocationActive] = useState(false); // Estado de la geolocalización del usuario

  const checkedNotification = () => {
    if (isUserLocationActive && !notification) {
      setNotification(true);
      console.log("Notificación activada");
    } else {
      setNotification(false);
      console.log("Notificación desactivada");
    }
  };

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
              {/* Sidebar content here */}
              <li>
                <a>Comedor Universitario</a>
              </li>
              <li>
                <a>Residencia estudiantil</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-dvh">
        <div className="flex-1 w-screen bg-base-100 relative flex flex-col lg:flex-row items-center justify-center lg:gap-5 lg:p-16">
          
          {/* Mapa */}
          <CarMap stopBus={stopBus} setStopBus={setStopBus} notification={notification} isUserLocationActive={isUserLocationActive} setIsUserLocationActive={setIsUserLocationActive} />
          {/* Extra */}
          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title m-0 p-0 max-h-5 h-5">
              <div className="flex justify-center items-center w-full h-full">
                <div className="w-2/5 h-1 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="collapse-content">
              <div className="lg:w-1/4 lg:h-full flex flex-col justify-between">
                <div className="justify-between hidden lg:flex ">
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
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
