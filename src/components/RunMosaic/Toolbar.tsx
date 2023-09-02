import React from "react";

import "./Toolbar.css";
import Dropdown from "./Dropdown";
import { AddThing } from "./AddThing";
import ExportRouteButton from "./ExportRouteButton";

interface ToolbarProps {
  onButtonClick: (action: string) => void;
  onAddDisplay: (display: string) => void;
  missingDisplays: string[];
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddDisplay, missingDisplays }) => {
  return (
    <div className="toolbar">
      <AddThing />
      <div className="dropdown">
        {missingDisplays.length !== 0 && <Dropdown options={missingDisplays} onSelect={onAddDisplay} />}
      </div>
      <ExportRouteButton />
    </div>
  );
};

export default Toolbar;
