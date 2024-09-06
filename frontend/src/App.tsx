import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import UserRoutes from "./Routes/UserRoutes";
// import AdminRoutes from './Routes/adminRoutes';
// import DoctorRoutes from './Routes/doctorRoutes';
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          {/* <Route path="/admin" element={<AdminRoutes />} />
          <Route path="/doctor" element={<DoctorRoutes />} /> */}
        </Routes>
      </Router>
      <Toaster position="top-center" expand={false} richColors />
    </>
  );
}
export default App;
