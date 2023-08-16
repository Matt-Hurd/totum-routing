import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NoteEditor from "../NoteEditor/NoteEditor";
import { selectRouteData, updatePoint } from "../../store/routeSlice";
import { selectSelection } from "../../store/selectionSlice";

const PointNotesDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const { pointIndex, branchIndex } = useSelector(selectSelection);
  const route = useSelector(selectRouteData);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!route || branchIndex === null || pointIndex === null) return;
    const point = route.branches[branchIndex].points[pointIndex];
    setNotes(point.htmlNote);
  }, [pointIndex, branchIndex, route?.branches, route?.game, route?.name, route]);

  if (!route || pointIndex === null || branchIndex === null) return null;

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

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default PointNotesDisplay;
