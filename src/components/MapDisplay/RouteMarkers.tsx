import React, { useRef } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { Thing } from "../../models";
import { useDispatch, useSelector } from "react-redux";

import { addPoint, selectRouteData } from "../../store/routeSlice";
import { selectSelection, setBranchIndex, setPointIndex } from "../../store/selectionSlice";
import { selectThingVisibility } from "../../store/thingVisibilitySlice";
import { Icon } from "leaflet";
import L from "leaflet";
import { Action } from "../../models/Point";
import ThingPopup from "./ThingPopup";

export const RouteMarkers: React.FC = () => {
  const route = useSelector(selectRouteData);
  const selection = useSelector(selectSelection);
  const { thingVisibility, hideThingsInBranch } = useSelector(selectThingVisibility);
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

  const handleDoubleClick = (thing: Thing) => {
    const thingUsage = findUsageOfThing(thing.uid);
    if (thingUsage.length === 1) {
      dispatch(setBranchIndex(thingUsage[0].branchIndex));
      dispatch(setPointIndex(thingUsage[0].pointIndex));
    }
  };

  const handleAltClick = (thing: Thing) => {
    if (selection.branchIndex !== null && selection.pointIndex !== null) {
      dispatch(
        addPoint({
          branchIndex: selection.branchIndex,
          point: { thingId: thing.uid, htmlNote: "", shortNote: "", action: Action.None },
          pointIndex: selection.pointIndex + 1,
        }),
      );
      dispatch(setPointIndex(selection.pointIndex + 1));
    }
  };

  const findUsageOfThing = (
    thingId: string,
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
  const thingIdsInInvisibleBranches = new Set();
  route.branches.forEach((branch) => {
    if (!branch.enabled) {
      branch.points.forEach((point) => {
        thingIdsInInvisibleBranches.add(point.thingId);
      });
    }
  });

  const thingIdsInVisibleBranches = new Set();
  route.branches.forEach((branch) => {
    if (branch.enabled) {
      branch.points.forEach((point) => {
        thingIdsInVisibleBranches.add(point.thingId);
      });
    }
  });

  const filteredThings = Object.values(route.things).filter((thing) => {
    if (thing.layerId !== selection.layer) return false;
    if (thingIdsInVisibleBranches.has(thing.uid)) return true;

    // Check if the thing type is visible
    if (!thingVisibility[thing.type]) return false;

    // Check if the thing is already in an invisible branch and hideThingsInBranch is true
    if (hideThingsInBranch && thingIdsInInvisibleBranches.has(thing.uid)) return false;

    return true;
  });

  return (
    <LayerGroup>
      {filteredThings.map((thing) => {
        const { coordinates } = thing;

        return (
          <Marker
            key={thing.uid}
            position={[-coordinates.x, coordinates.y]}
            icon={getIconForThing(thing)}
            ref={(ref) => markerRefs.current.set(thing.uid, ref)}
            eventHandlers={{
              dblclick: () => handleDoubleClick(thing),
              click: (e) => {
                if (e.originalEvent.altKey) {
                  handleAltClick(thing);
                }
              },
            }}
          >
            <Popup autoPan={false}>
              <ThingPopup thing={thing} findUsageOfThing={findUsageOfThing} />
            </Popup>
          </Marker>
        );
      })}
    </LayerGroup>
  );
};
