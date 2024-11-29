import userRoute from "./userRoute";
import doctorRoute from "./doctorRoute";
import adminRoute from "./adminRoute";
import chatRoute from "./chatRoutes";
import notificationRoute from "./notificationRoutes";

export default (app:any) => {
    app.use("/api/user", userRoute);
    app.use("/api/doctor", doctorRoute);
    app.use("/api/admin", adminRoute);
    app.use("/api/chat", chatRoute);
    app.use("/api/notification", notificationRoute);
};