import React, { useState } from "react";
import { Dialog, InputGroup, Button, NumericInput, Divider } from "@blueprintjs/core";
import { useDispatch } from "react-redux";
import { Thing } from "../../models";
import { updateThing } from "../../store/routeSlice";

interface ThingEditorProps {
  thing: Thing;
  isOpen: boolean;
  onClose: () => void;
}

const ThingEditor: React.FC<ThingEditorProps> = ({ thing, isOpen, onClose }) => {
  const [editedThing, setEditedThing] = useState<Thing>({ ...thing });
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(updateThing(editedThing));
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Thing">
      <div className="bp5-dialog-body">
        <InputGroup
          value={editedThing.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditedThing({ ...editedThing, name: e.target.value })
          }
          placeholder="Name"
        />
        <InputGroup
          value={editedThing.uid}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedThing({ ...editedThing, uid: e.target.value })}
          placeholder="UID"
        />
        <NumericInput
          value={editedThing.coordinates.x}
          onValueChange={(value: number) =>
            setEditedThing({ ...editedThing, coordinates: { ...editedThing.coordinates, x: value } })
          }
          placeholder="Coordinate X"
        />
        <NumericInput
          value={editedThing.coordinates.y}
          onValueChange={(value: number) =>
            setEditedThing({ ...editedThing, coordinates: { ...editedThing.coordinates, y: value } })
          }
          placeholder="Coordinate Y"
        />
        <NumericInput
          value={editedThing.coordinates.z}
          onValueChange={(value: number) =>
            setEditedThing({ ...editedThing, coordinates: { ...editedThing.coordinates, z: value } })
          }
          placeholder="Coordinate Z"
        />
        <InputGroup
          value={editedThing.icon}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditedThing({ ...editedThing, icon: e.target.value })
          }
          placeholder="Icon"
        />
        <InputGroup
          value={editedThing.type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditedThing({ ...editedThing, type: e.target.value })
          }
          placeholder="Type"
        />
        <InputGroup
          value={editedThing.layerId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditedThing({ ...editedThing, layerId: e.target.value })
          }
          placeholder="Layer"
        />
      </div>
      <Divider />
      <div className="bp5-dialog-footer">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </Dialog>
  );
};

export default ThingEditor;
