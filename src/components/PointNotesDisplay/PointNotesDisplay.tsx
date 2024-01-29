import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NoteEditor from "../NoteEditor/NoteEditor";
import { selectRouteData, updatePoint } from "../../store/routeSlice";
import { selectSelection } from "../../store/selectionSlice";
import { Thing } from "../../models";
import { Action } from "../../models/Point";

const PointNotesDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const { pointIndex, branchIndex } = useSelector(selectSelection);
  const route = useSelector(selectRouteData);
  const [notes, setNotes] = useState("");
  const [currentAction, setCurrentAction] = useState<Action>(Action.None);

  useEffect(() => {
    if (!route || branchIndex === null || pointIndex === null || !route.branches[branchIndex].points[pointIndex])
      return;
    const point = route.branches[branchIndex].points[pointIndex];
    setNotes(point.htmlNote);

    const thing: Thing | undefined = route.things[point.thingId];
    if (thing && (thing.type === "Shrine" || thing.type === "Lightroot")) {
      if (!point.action) {
        let wasPreviouslySeen = false;

        // Loop through branches and points to check if the current Thing was previously activated or completed
        for (const branch of route.branches) {
          for (const p of branch.points) {
            if (p.thingId === thing.uid && (p.action === Action.Activate || p.action === Action.Complete)) {
              wasPreviouslySeen = true;
              break;
            }
          }
          if (wasPreviouslySeen) break;
        }

        setCurrentAction(wasPreviouslySeen ? Action.Warp : Action.Complete);
      } else {
        setCurrentAction(point.action);
      }
    }
  }, [pointIndex, branchIndex, route?.branches, route?.game, route?.name, route]);

  if (!route || pointIndex === null || branchIndex === null || !route.branches[branchIndex].points[pointIndex])
    return null;

  const isShrineOrLightroot = (thing: Thing) => {
    return thing.type === "Shrine" || thing.type === "Lightroot" || thing.type === "level";
  };

  const handleNotesChange = (content: string) => {
    if (pointIndex === null || branchIndex === null) return;

    const point = route.branches[branchIndex].points[pointIndex];

    if (content === "<p><br></p>" || content === "<p></p>") {
      content = "";
    }

    setNotes(content);

    const updatedPoint = { ...point, htmlNote: content };
    dispatch(updatePoint({ branchIndex: branchIndex, point: updatedPoint, pointIndex: pointIndex }));
  };

  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const actionValue: Action = event.target.value as Action;
    setCurrentAction(actionValue);

    if (branchIndex === null || pointIndex === null) return;
    const point = route.branches[branchIndex].points[pointIndex];
    const updatedPoint = { ...point, action: actionValue };
    dispatch(updatePoint({ branchIndex: branchIndex, point: updatedPoint, pointIndex: pointIndex }));
  };

  return (
    <>
      {isShrineOrLightroot(route.things[route.branches[branchIndex].points[pointIndex].thingId]) && (
        <select value={currentAction} onChange={handleActionChange}>
          <option value={Action.Complete}>COMPLETE</option>
          <option value={Action.Warp}>WARP</option>
          <option value={Action.Activate}>ACTIVATE</option>
        </select>
      )}
      <NoteEditor notes={notes} onNotesChange={handleNotesChange} />
    </>
  );
};

export default PointNotesDisplay;
