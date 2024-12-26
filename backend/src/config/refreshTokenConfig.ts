import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createToken } from "./jwtConfig";

dotenv.config();

const secret_key = process.env.JWT_SECRET as string;

const refreshTokenHandler = (req: Request, res: Response) => {

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing." });
  }

  jwt.verify(refreshToken, secret_key, (err: jwt.VerifyErrors | null) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }

    const newAccessToken = createToken(userId, "user");


    res.json({ accessToken: newAccessToken });
  });
};
const doctorRefreshTokenHandler = (req: Request, res: Response) => {

  const { doctorId } = req.body;

  if (!doctorId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const docrefreshToken = req.cookies.docrefreshToken;

  if (!docrefreshToken) {
    return res.status(401).json({ message: "Refresh token is missing." });
  }

  jwt.verify(docrefreshToken, secret_key, (err: jwt.VerifyErrors | null) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }

    const newAccessToken = createToken(doctorId, "doctor");


    res.json({ accessToken: newAccessToken });
  });
};

export { refreshTokenHandler, doctorRefreshTokenHandler };
