import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;
import cookieParser from "cookie-parser";
import userRoute from "../src/routes/userRoute";
import doctorRoute from "../src/routes/doctorRoute";
import adminRoute from "../src/routes/adminRoute"
import connectDB from "./config/dataBase";
import "./config/cronjob"
connectDB();

app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "5gb" }));
app.use(express.urlencoded({ limit: "5gb", extended: true }));

app.get("/", async (req, res) => {
  if (req.cookies.token) {
    console.log(req.cookies.token);
  } else {
    res.status(404).send("Data not found");
  }
});

app.use("/api/user", userRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/admin",adminRoute)

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
