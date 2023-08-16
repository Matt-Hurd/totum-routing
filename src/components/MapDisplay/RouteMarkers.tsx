import React, { useRef } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { Thing, Point } from "../../models";
import { useDispatch, useSelector } from "react-redux";

import "./popup.css";
import { addPoint, deletePoint, selectRouteData } from "../../store/routeSlice";
import L, { Icon } from "leaflet";
import { selectSelection, setBranchIndex, setPointIndex } from "../../store/selectionSlice";

export const RouteMarkers: React.FC = () => {
  const route = useSelector(selectRouteData);
  const selection = useSelector(selectSelection);
  const dispatch = useDispatch();

  const markerRefs = useRef(new Map());

  const icons: Record<string, Icon> = {};

  const defaultIcon = L.icon({
    iconUrl: new URL("/assets/images/route_icons/blank.png", import.meta.url).href,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const getIconForThing = (thing: Thing) => {
    if (!thing.icon) return defaultIcon;
    const icon = icons[thing.icon];
    if (icon !== undefined) {
      return icon;
    }

    const newIcon = L.icon({
      iconUrl: "/assets/icons/" + thing.icon + ".png",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    icons[thing.icon] = newIcon;
    return newIcon;
  };

  if (!route) return null;

  const handleDoubleClick = (branchIndex: number, pointIndex: number) => {
    dispatch(setBranchIndex(branchIndex));
    dispatch(setPointIndex(pointIndex));
  };

  const handleAltClick = (point: Point) => {
    if (selection.branchIndex !== null && selection.pointIndex !== null) {
      dispatch(addPoint({ branchIndex: selection.branchIndex, point: point, pointIndex: selection.pointIndex + 1 }));
      dispatch(setPointIndex(selection.pointIndex + 1));
    }
  };

  const findUsageOfThing = (
    thingId: string
  ): Array<{ branchName: string; branchIndex: number; pointIndex: number }> => {
    const usages: Array<{ branchName: string; branchIndex: number; pointIndex: number }> = [];

    route.branches.forEach((branch, branchIndex) => {
      branch.points.forEach((point, pointIndex) => {
        if (point.thingId === thingId) {
          usages.push({ branchName: branch.name, branchIndex, pointIndex });
        }
      });
    });

    return usages;
  };

  return (
    <LayerGroup>
      {route.branches
        .filter((branch) => branch.enabled)
        .flatMap((branch, branchIndex) =>
          branch.points.map((point, pointIndex) => {
            const currentThing = route.things[point.thingId];
            const { coordinates, name } = currentThing;
            const opacity = currentThing.layerId === selection.layer ? 1 : 0;

            return (
              <Marker
                key={branch.name + " : " + pointIndex}
                opacity={opacity}
                position={[-coordinates.x, coordinates.y]}
                icon={getIconForThing(currentThing)}
                ref={(ref) => markerRefs.current.set(point.thingId, ref)}
                eventHandlers={{
                  dblclick: () => handleDoubleClick(branchIndex, pointIndex),
                  click: (e) => {
                    if (e.originalEvent.altKey) {
                      handleAltClick(point);
                    }
                  },
                }}
              >
                <Popup autoPan={false}>
                  {name}
                  <br />
                  {coordinates.y.toFixed(0)} | {coordinates.x.toFixed(0)} | {coordinates.z.toFixed(0)}
                  <br />
                  {findUsageOfThing(point.thingId).map((usage) => (
                    <div key={`${usage.branchName}-${usage.pointIndex}`}>
                      {usage.branchName} {usage.pointIndex}
                      <button onClick={() => handleDoubleClick(usage.branchIndex, usage.pointIndex)}>Select</button>
                      <button
                        onClick={() =>
                          dispatch(deletePoint({ branchIndex: usage.branchIndex, pointIndex: usage.pointIndex }))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </Popup>
              </Marker>
            );
          })
        )}
    </LayerGroup>
  );
};
