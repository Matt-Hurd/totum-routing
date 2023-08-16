import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { MapContainer, Pane, TileLayer, ImageOverlay } from "react-leaflet";
import { useSelector } from "react-redux";
import { RouteMarkers } from "./RouteMarkers";
import RouteLines from "./RouteLines";
import { outerBounds, crs } from "./mapConstants";
import { selectRouteData } from "../../store/routeSlice";

import "./leaflet_tile_workaround.js";
import { selectSelection } from "../../store/selectionSlice.js";

const MapDisplay: React.FC = () => {
  const selection = useSelector(selectSelection);
  const route = useSelector(selectRouteData);

  if (!route) return null;

  const style = {
    height: "100%",
    width: "100%",
  };

  // TODO

  return (
    <MapContainer style={style} bounds={outerBounds} zoom={0} maxZoom={7} minZoom={-5} crs={crs} keyboard={false}>
      <RouteMarkers />
      <RouteLines />
      <Pane name="tile_bg" style={{ zIndex: 1 }}>
        <TileLayer url={route.game.layers[selection.layer].imagePath} bounds={outerBounds} />
      </Pane>
      <Pane name="bg" style={{ zIndex: 0 }}>
        <ImageOverlay url={route.url + route.game.layers[selection.layer].baseImagePath} bounds={outerBounds} />
      </Pane>
    </MapContainer>
  );
};

export default MapDisplay;
