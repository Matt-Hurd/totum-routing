import "leaflet/dist/leaflet.css";

import "./leaflet_tile_workaround.js";
import { MapContainer, Pane, TileLayer, ImageOverlay } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { RouteMarkers } from "./RouteMarkers";
import RouteLines from "./RouteLines";
import { crs } from "./mapConstants";
import { selectRouteData } from "../../store/routeSlice";

import "./leaflet_tile_workaround.js";
import { selectSelection, setLayer } from "../../store/selectionSlice.js";
import { LatLngBounds } from "leaflet";

const MapDisplay: React.FC = () => {
  const selection = useSelector(selectSelection);
  const route = useSelector(selectRouteData);
  const dispatch = useDispatch();

  if (!route) return null;
  if (selection.layer == null) {
    dispatch(setLayer(Object.keys(route.game.layers)[0]));
    return null;
  }

  const style = {
    height: "100%",
    width: "100%",
  };

  const layer = route.game.layers[selection.layer];
  const basePath = layer.baseImagePath;
  const imageUrl = basePath.startsWith("/") ? route.url + basePath : basePath;
  const xoffset = -960;
  const yoffset = -540;
  // const xoffset = -90;
  // const yoffset = -66;
  const scale = .1;
  const outerBounds = new LatLngBounds([yoffset* scale, xoffset* scale], [(yoffset + 1080) * scale, (xoffset + 1920) * scale]);

  return (
    <MapContainer style={style} bounds={outerBounds} zoom={0} maxZoom={7} minZoom={-5} crs={crs} keyboard={false}>
      <RouteMarkers />
      <RouteLines />
      {layer.imagePath && (
        <Pane name="tile_bg" style={{ zIndex: 1 }}>
          <TileLayer url={layer.imagePath} bounds={outerBounds} />
        </Pane>
      )}
      <Pane name="bg" style={{ zIndex: 0 }}>
        <ImageOverlay url={imageUrl} bounds={outerBounds} />
      </Pane>
    </MapContainer>
  );
};

export default MapDisplay;
