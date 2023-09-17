import React, { useState } from "react";
import { Thing } from "../../models";
import { useDispatch } from "react-redux";
import { addThing } from "../../store/routeSlice";
import { Dialog, Button, InputGroup } from "@blueprintjs/core";
import ThingEditor from "../MapDisplay/ThingEditor";

export const AddThing: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newThing, setNewThing] = useState<Thing | null>(null);
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUid(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch(`https://radar-totk.zeldamods.org/obj_by_hash/${uid}`);
    const data = await response.json();

    const adjusted_z = data.pos[1] - 105.499;

    let estimated_layer = "surface";
    if (adjusted_z < -200) estimated_layer = "depths";
    if (adjusted_z > 850) estimated_layer = "sky";

    const newThing: Thing = {
      uid: data.hash_id,
      name: data.name,
      coordinates: {
        x: -data.pos[2],
        y: data.pos[0],
        z: adjusted_z,
      },
      layerId: estimated_layer,
      dependencyIds: [],
      icon: "",
      type: "Thing",
      isNativeObject: true,
    };

    dispatch(addThing(newThing));
    setNewThing(newThing);
    setIsEditorOpen(true);
    setModalOpen(false);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Add Thing</Button>

      <Dialog isOpen={isModalOpen} title="Add Thing" onClose={() => setModalOpen(false)}>
        <div className="bp3-dialog-body">
          <InputGroup value={uid} onChange={handleInputChange} placeholder="Enter UID" />
        </div>
        <div className="bp3-dialog-footer">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </Dialog>

      {newThing && <ThingEditor thing={newThing} isOpen={isEditorOpen} onClose={closeEditor} />}
    </div>
  );
};
