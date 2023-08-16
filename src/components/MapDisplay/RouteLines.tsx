import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import PolylineWithArrow from "./PolylineWithArrow";
import { selectRouteData } from "../../store/routeSlice";
import { selectSelection } from "../../store/selectionSlice";
import { Branch } from "../../models";

const RouteLines: React.FC = () => {
  const route = useSelector(selectRouteData);
  const selection = useSelector(selectSelection);

  if (!route) return null;

  const polylines: ReactElement[] = [];
  const visibleLayerId = selection.layer || route.game.layers[0].name || null;

  route.branches.filter((branch) => branch.enabled).forEach((branch: Branch) => {
    let lastLayerId = null;
    let lastPosition = null;
    for (let i = 0; i < branch.points.length; i++) {
      const point = branch.points[i];
      const thing = route.things[point.thingId];
      if (!thing) continue;

      
    if (i === 0 && lastLayerId === null) {
      lastLayerId = thing.layerId;
    }

    if ((thing.layerId === visibleLayerId || lastLayerId === visibleLayerId) && lastPosition !== null) {
      const position = [-thing.coordinates.x, thing.coordinates.y];
      polylines.push(
        <PolylineWithArrow
          key={`polyline-${polylines.length}`}
          positions={[lastPosition, position]}
          color="blue"
          warp={point.action === "WARP"}
        />,
      );
    }

    lastPosition = [-thing.coordinates.x, thing.coordinates.y];
    lastLayerId = thing.layerId;

    }
  })

  return <>{polylines}</>;
};

export default RouteLines;
