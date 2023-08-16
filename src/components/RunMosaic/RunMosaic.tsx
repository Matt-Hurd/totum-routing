import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dropRight from "lodash/dropRight";
import { filter } from "lodash";

import {
  Mosaic,
  MosaicWindow,
  MosaicBranch,
  getPathToCorner,
  Corner,
  getNodeAtPath,
  getOtherDirection,
  updateTree,
  getLeaves,
  MosaicDirection,
  MosaicParent,
  MosaicNode,
  RemoveButton,
} from "react-mosaic-component";
import "./RunMosaic.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "react-mosaic-component/react-mosaic-component.css";
import "react-mosaic-component/styles/index.less";

import Toolbar from "./Toolbar";
import MapDisplay from "../MapDisplay/MapDisplay";
import RouteListDisplay from "../RouteListDisplay/RouteListDisplay";
import BranchNotesDisplay from "../BranchNotesDisplay/BranchNotesDisplay";
import PointNotesDisplay from "../PointNotesDisplay/PointNotesDisplay";

import { selectRouteStatus } from "../../store/routeSlice";
import StorageManager from "../../utils/StorageManager";
import { RootState } from "../../store";
import LayerToggle from "../LayerToggle/LayerToggle";

const RunMosaic: React.FC = () => {
  const routeStatus = useSelector(selectRouteStatus);
  const darkMode = useSelector((state: RootState) => state.userPreferences.darkMode);

  const initialLayoutStorage = StorageManager.getItem("layout");
  const initialLayout = initialLayoutStorage
    ? JSON.parse(initialLayoutStorage)
    : {
        direction: "row",
        first: {
          direction: "column",
          first: "Map",
          second: "Route List",
        },
        second: {
          first: "Point Notes",
          second: "Branch Notes",
          direction: "column",
        },
      };

  const [currentNode, setCurrentNode] = useState<MosaicNode<string> | null>(initialLayout);

  const findMissingDisplays = (node: MosaicNode<string> | null) => {
    const allDisplays = ["Map", "Route List", "Point Notes", "Branch Notes", "Layer Toggle"];
    const allVisibleDisplays = getLeaves(node);
    return filter(allDisplays, (display) => {
      return !allVisibleDisplays.includes(display);
    });
  };

  const [availableDisplays, setAvailableDisplays] = useState<string[]>(findMissingDisplays(currentNode));

  useEffect(() => {
    console.log(routeStatus);
  }, [routeStatus]);

  if (routeStatus !== "succeeded") {
    return <div>Loading...</div>;
  }

  const renderWindow = (id: string, path: MosaicBranch[]) => {
    let component: JSX.Element;

    switch (id) {
      case "Map":
        component = <MapDisplay />;
        break;
      case "Route List":
        component = <RouteListDisplay />;
        break;
      case "Point Notes":
        component = <PointNotesDisplay />;
        break;
      case "Branch Notes":
        component = <BranchNotesDisplay />;
        break;
      case "Layer Toggle":
        component = <LayerToggle />;
        break;
      default:
        component = <div />;
    }

    return (
      <MosaicWindow path={path} title={id} toolbarControls={[<RemoveButton key="removeButton" />]}>
        {component}
      </MosaicWindow>
    );
  };

  const onChange = (newCurrentNode: MosaicNode<string> | null) => {
    StorageManager.setItem("layout", JSON.stringify(newCurrentNode));
    setCurrentNode(newCurrentNode);
    setAvailableDisplays(findMissingDisplays(newCurrentNode));
  };

  const darkModeClass = darkMode ? "darkmode" : "";

  const addToTopRight = (displayType: string) => {
    console.log(currentNode);
    if (currentNode) {
      const path = getPathToCorner(currentNode, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(currentNode, dropRight(path)) as MosaicParent<string>;
      const destination = getNodeAtPath(currentNode, path) as MosaicNode<string>;
      const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : "row";

      let first: MosaicNode<string>;
      let second: MosaicNode<string>;
      if (direction === "row") {
        first = destination;
        second = displayType;
      } else {
        first = displayType;
        second = destination;
      }

      const newTree = updateTree(currentNode, [
        {
          path,
          spec: {
            $set: {
              direction,
              first,
              second,
            },
          },
        },
      ]);
      setCurrentNode(newTree);
      setAvailableDisplays(findMissingDisplays(newTree));
    }
  };

  const handleToolbarButtonClick = (action: string) => {
    console.log("Button action:", action);
  };

  const handleToolbarAddDisplay = (selectedOption: string) => {
    addToTopRight(selectedOption);
  };

  return (
    <div className={"run-mosaic " + darkModeClass}>
      {availableDisplays.length !== 0 && (
        <Toolbar
          onButtonClick={handleToolbarButtonClick}
          onAddDisplay={handleToolbarAddDisplay}
          missingDisplays={availableDisplays}
        />
      )}
      <Mosaic renderTile={renderWindow} onChange={onChange} value={currentNode} blueprintNamespace="bp5" />
    </div>
  );
};

export default RunMosaic;
