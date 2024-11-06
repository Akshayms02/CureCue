import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import UserRoutes from "./Routes/UserRoutes";
import DoctorRoutes from "./Routes/DoctorRoutes";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "../components/ui/themeProvider";
import AdminRoutes from "./Routes/AdminRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/store";
import VideoCallOut from "./Components/DoctorComponents/VideoCallOut";
import UserVideoIn from "./Components/UserComponents/UserVideoIn";
import VideoChatDoctor from "./Components/DoctorComponents/VideoCallDoctor";
import VideoChatUser from "./Components/UserComponents/VideoCallUser";

function App() {
  const { videoCall, showVideoCallDoctor } = useSelector((state: RootState) => state.doctor)
  const { showIncomingVideoCall, showVideoCallUser } = useSelector((state: RootState) => state.user)
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          {videoCall && <VideoCallOut />}
          {showIncomingVideoCall && <UserVideoIn />}
          {showVideoCallDoctor && <VideoChatDoctor />}
          {showVideoCallUser && <VideoChatUser />}
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/doctor/*" element={<DoctorRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />}></Route>
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </>
  );
}
export default App;
