import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import UserRoutes from "./Routes/UserRoutes";
import DoctorRoutes from "./Routes/DoctorRoutes";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "../components/ui/themeProvider";
import AdminRoutes from "./Routes/AdminRoutes";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/doctor/*" element={<DoctorRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes/>}></Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </>
  );
}
export default App;
