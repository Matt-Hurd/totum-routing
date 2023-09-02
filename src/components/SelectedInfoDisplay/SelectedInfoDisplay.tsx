import React from "react";
import { useSelector } from "react-redux";
import { selectRouteData } from "../../store/routeSlice";
import { selectSelection } from "../../store/selectionSlice";
import "./SelectedInfoDisplay.scss";

const SelectedInfoDisplay: React.FC = () => {
  const { pointIndex, branchIndex } = useSelector(selectSelection);
  const route = useSelector(selectRouteData);

  let branchName = null;
  let thingName = null;

  if (route && branchIndex !== null && branchIndex < route.branches.length) {
    const branch = route.branches[branchIndex];
    branchName = branch.name;

    if (pointIndex !== null && pointIndex < branch.points.length && pointIndex >= 0) {
      const point = branch.points[pointIndex];
      const thing = route.things[point.thingId];
      thingName = thing.name;
    }
  }

  return (
    <div className="selected-info">
      {branchName && (
        <div className="branch-info">
          [{branchIndex}] {branchName}
        </div>
      )}
      {thingName && (
        <div className="thing-info">
          [{pointIndex}] {thingName}
        </div>
      )}
    </div>
  );
};

export default SelectedInfoDisplay;
