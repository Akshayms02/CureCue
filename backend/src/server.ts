import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = process.env.PORT || 5000;
import connectDB from "./config/dataBase";
import "./config/cronjob";
import { createServer } from "http";
import { configSocketIO } from "./config/socketConfig";
import routes from "./routes"
import serverMiddlewares from "./utils/serverMiddlewares";

connectDB();
serverMiddlewares(app)
routes(app)
const server = createServer(app);
configSocketIO(server);

process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
process.on("SIGINT", () => {
  console.log("SIGINT received: Closing server...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
