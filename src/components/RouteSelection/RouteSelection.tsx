import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadRoute, selectRouteData } from "../../store/routeSlice";
import { Route } from "../../models";
import { useNavigate } from "react-router-dom";
import { Dialog, Button } from "@blueprintjs/core";

function RouteSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const existingRoute = useSelector(selectRouteData);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  useEffect(() => {
    if (existingRoute.game.name) {
      setIsDialogOpen(true);
    }
  }, [existingRoute]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === "string") {
            const parsedRoute: Route = JSON.parse(content);
            dispatch(uploadRoute(parsedRoute));
            navigate("/route");
          }
        } catch (error) {
          console.error("Failed to parse route:", error);
          // Handle the error. Maybe update the state to show an error message.
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResume = () => {
    setIsDialogOpen(false);
    navigate("/route");
  };

  return (
    <div>
      <h3>Upload a route file</h3>
      <input type="file" accept=".json" onChange={handleFileUpload} />

      <Dialog isOpen={isDialogOpen} title="Resume Session" onClose={() => setIsDialogOpen(false)}>
        <div className="bp3-dialog-body">
          <p>A session already exists. Would you like to resume?</p>
        </div>
        <div className="bp3-dialog-footer">
          <div className="bp3-dialog-footer-actions">
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button intent="primary" onClick={handleResume}>
              Resume
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default RouteSelection;
