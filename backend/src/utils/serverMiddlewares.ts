
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";

const serverMiddlewares = (app: any) => {

    // CORS
    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
    };
    app.use(cors(corsOptions));

    // Cookie parsing
    app.use(cookieParser());

    // Body parsers
    app.use(express.json({ limit: "50mb" })); // Adjust limit as needed
    app.use(express.urlencoded({ extended: true }));

    // Setting Rules
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        next();
    });
};

export default serverMiddlewares;
