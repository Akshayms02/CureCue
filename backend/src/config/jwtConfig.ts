import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// const createToken = (user_id: string): string => {
//   const newToken = jwt.sign({ user_id }, process.env.JWT_SECRET as string, {
//     expiresIn: "60s",
//   });
//   return newToken;
// };

const createToken = (user_id: string, role: string): string => {
  return jwt.sign({ user_id, role }, secret_key, { expiresIn: "45m" });
};

const createAdminToken = (email: string, role: string): string => {
  return jwt.sign({ email, role }, secret_key, { expiresIn: "45m" });
};

const createRefreshToken = (user_id: string, role: string): string => {
  return jwt.sign({ user_id, role }, secret_key, { expiresIn: "7d" });
};

const secret_key = process.env.JWT_SECRET as string;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Authorization failed.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed.");
  }

  if (token) {
    jwt.verify(token, secret_key, async (err, decoded) => {
      if (err) {
        await handleRefreshToken(req, res, next);
      } else {
        const { role } = decoded as jwt.JwtPayload;
        if (role !== "user") {
          return res
            .status(401)
            .json({ message: "Access denied. Insufficient role." });
        }

        next();
      }
    });
  } else {
    await handleRefreshToken(req, res, next);
  }
};
const verifyDocToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Authorization failed.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed.");
  }

  if (token) {
    jwt.verify(token, secret_key, async (err, decoded) => {
      if (err) {
        await handleRefreshToken(req, res, next);
      } else {
        const { role } = decoded as jwt.JwtPayload;
        if (role !== "doctor") {
          return res
            .status(401)
            .json({ message: "Access denied. Insufficient role." });
        }

        next();
      }
    });
  } else {
    await handleRefreshToken(req, res, next);
  }
};
const verifyAdminToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Authorization failed.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed.");
  }

  if (token) {
    jwt.verify(token, secret_key, async (err, decoded) => {
      if (err) {
        await handleRefreshToken(req, res, next);
      } else {
        const { role } = decoded as jwt.JwtPayload;
        if (role !== "admin") {
          return res
            .status(401)
            .json({ message: "Access denied. Insufficient role." });
        }

        next();
      }
    });
  } else {
    await handleRefreshToken(req, res, next);
  }
};

const handleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken: string = req.cookies.RefreshToken;
  if (refreshToken) {
    jwt.verify(refreshToken, secret_key, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Access denied. Refresh token not valid." });
      } else {
        const { user_id, role } = decoded as jwt.JwtPayload;

        if (!user_id || !role) {
          return res
            .status(401)
            .json({ message: "Access denied. Token payload invalid." });
        } else {
          const newAccessToken = createToken(user_id, role);
          res.cookie("AccessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Access denied. Refresh token not provided." });
  }
};

export {
  secret_key,
  createToken,
  verifyToken,
  createAdminToken,
  createRefreshToken,
  verifyDocToken,
  verifyAdminToken
};
