import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createToken = (user_id: string): string => {
  const newToken = jwt.sign({ user_id }, process.env.JWT_SECRET as string, {
    expiresIn: "60s",
  });
  return newToken;
};

const secret_key = process.env.JWT_SECRET as string;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Authorization failed.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed.");
  }

  jwt.verify(token, secret_key, (err: any) => {
    return res.status(401).send(`Authorization failed : ${err}`);
  });
};

export { secret_key, createToken, verifyToken };
