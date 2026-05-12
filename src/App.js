import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="font-sans">
      <AppRoutes />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
