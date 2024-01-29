import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelection, setBranchIndex, setPointIndex } from "../../store/selectionSlice";
import { Thing } from "../../models";
import { deletePoint, deleteThing } from "../../store/routeSlice";
import "./ThingPopup.css";
import { Button, Dialog, Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import ThingEditor from "./ThingEditor";

interface ThingPopupProps {
  thing: Thing;
  findUsageOfThing: (thingId: string) => Array<{ branchName: string; branchIndex: number; pointIndex: number }>;
}

const ThingPopup: React.FC<ThingPopupProps> = ({ thing, findUsageOfThing }) => {
  const dispatch = useDispatch();
  const selection = useSelector(selectSelection);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteThing(thing.uid));
    setIsDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };
  const { coordinates, name } = thing;

  const handleSelect = (branchIndex: number, pointIndex: number) => {
    dispatch(setBranchIndex(branchIndex));
    dispatch(setPointIndex(pointIndex));
  };

  const usages = findUsageOfThing(thing.uid);

  return (
    <div>
      {name}
      <br />
      {coordinates.x.toFixed(0)} | {coordinates.y.toFixed(0)} | {coordinates.z.toFixed(0)}
      <br />
      {usages.map((usage) => (
        <div key={`${usage.branchName}-${usage.pointIndex}`}>
          {usage.branchName} {usage.pointIndex}
          <button onClick={() => handleSelect(usage.branchIndex, usage.pointIndex)}>Select</button>
          <button
            onClick={() => {
              if (
                selection.pointIndex &&
                usage.branchIndex === selection.branchIndex &&
                usage.pointIndex <= selection.pointIndex
              )
                setPointIndex(selection.pointIndex - 1);
              dispatch(deletePoint({ branchIndex: usage.branchIndex, pointIndex: usage.pointIndex }));
            }}
          >
            Delete
          </button>
        </div>
      ))}
      <Button minimal icon={<Icon icon={IconNames.EDIT} />} onClick={handleEditClick} />
      {usages.length === 0 && <Button minimal icon={<Icon icon={IconNames.TRASH} />} onClick={handleDeleteClick} />}
      <ThingEditor thing={thing} isOpen={isEditorOpen} onClose={closeEditor} />
      <Dialog isOpen={isDeleteDialogOpen} title="Confirm Deletion" onClose={cancelDelete}>
        <div className="bp5-dialog-body">Are you sure you want to delete this thing?</div>
        <div className="bp5-dialog-footer">
          <div className="bp5-dialog-footer-actions">
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button intent={Intent.DANGER} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ThingPopup;
