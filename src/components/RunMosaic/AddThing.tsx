import React, { useState } from "react";
import { Thing } from "../../models";
import { useDispatch } from "react-redux";
import { addThing } from "../../store/routeSlice";

export const AddThing: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState("");
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

    const newThing: Thing = {
      uid: data.hash_id,
      name: data.name,
      coordinates: {
        x: -data.pos[2],
        y: data.pos[0],
        z: data.pos[1] - 105.499,
      },
      layerId: "surface",
      dependencyIds: [],
      icon: "",
      type: "Thing",
      isNativeObject: true,
    };

    dispatch(addThing(newThing));
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Add Thing</button>
      {isModalOpen && (
        <div className="modal">
          <input type="text" value={uid} onChange={handleInputChange} placeholder="Enter UID" />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};
