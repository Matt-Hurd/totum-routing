import { useDispatch } from "react-redux";
import { uploadRoute } from "../../store/routeSlice";
import { Route } from "../../models";
import { useNavigate } from "react-router-dom";

function RouteSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <div>
      {/* ... other UI elements */}
      <h3>Upload a route file</h3>
      <input type="file" accept=".json" onChange={handleFileUpload} />
    </div>
  );
}

export default RouteSelection;
