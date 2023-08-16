import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSelection } from "../../store/selectionSlice";
import NoteEditor from "../NoteEditor/NoteEditor";
import { selectRouteData, updateBranch } from "../../store/routeSlice";

const BranchNotesDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const { branchIndex } = useSelector(selectSelection);
  const route = useSelector(selectRouteData);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!route || branchIndex === null) return;
    const branchNote = route.branches[branchIndex].htmlNote;
    setNotes(branchNote);
  }, [branchIndex, route?.branches, route]);

  const handleNotesChange = (content: string) => {
    if (!route || branchIndex === null) return null;
    setNotes(content);

    dispatch(
      updateBranch({
        branch: { ...route.branches[branchIndex], htmlNote: content },
        index: branchIndex,
      })
    );
  };

  if (!route || branchIndex === null) return null;

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default BranchNotesDisplay;
