import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "lrm-valhalla";


const createRoutineMachineLayer = ({from, to}) => {
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(from[0], from[1]),
      L.latLng(to[0], to[1]),
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: true  ,
    addWaypoints: true ,
    routeWhileDragging: true,
    draggableWaypoints: false,
    fitSelectedRoutes: false ,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);


export default RoutingMachine;
