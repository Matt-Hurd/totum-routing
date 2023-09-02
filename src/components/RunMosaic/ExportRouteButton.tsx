import React from "react";
import { useSelector } from "react-redux";
import { selectRouteData } from "../../store/routeSlice";

const ExportRouteButton: React.FC = () => {
  const route = useSelector(selectRouteData);

  const handleExportRoute = () => {
    const cleanedRoute = JSON.parse(
      JSON.stringify(route, (_key, value) => {
        // Exclude empty fields (null, undefined or empty strings)
        if (value === null || value === undefined || value === "") return undefined;
        return value;
      }),
    );

    const blob = new Blob([JSON.stringify(cleanedRoute, null, 2)], { type: "application/json" });
    const blobURL = URL.createObjectURL(blob);

    const tempLink = document.createElement("a");
    tempLink.href = blobURL;
    tempLink.setAttribute("download", "route.json");
    tempLink.click();
  };

  return <button onClick={handleExportRoute}>Export Route</button>;
};

export default ExportRouteButton;
