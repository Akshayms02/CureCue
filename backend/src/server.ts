import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
const app = express();
const port = process.env.PORT || 5000;
import connectDB from "./config/dataBase";
import "./config/cronjob";
import { createServer } from "http";
import { configSocketIO } from "./config/socketConfig";
import routes from "./routes"
import serverMiddlewares from "./utils/serverMiddlewares";
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';
import fs from 'fs';
import path from 'path';

connectDB();
serverMiddlewares(app)
routes(app)
const server = createServer(app);
configSocketIO(server);

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const errorLogStream = rfs.createStream('error.log', {
  interval: '1d',
  path: logDirectory,
  maxFiles: 7,
});
app.use(
  morgan('combined', {
    stream: errorLogStream,
    skip: (req: Request, res: Response) => res.statusCode < 400,
  })
);

app.use(morgan('dev'))

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
