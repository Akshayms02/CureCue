
import { Request, Response, NextFunction } from "express";


import userModel from "../models/userModel";

async function userAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.headers['userid'];

        if (userId) {
            const user = await userModel.findOne({ userId })


            if (user?.isBlocked === true) {
                return res.status(403).json('User Blocked')
            }
        }

        next()

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error.' });
    }
}

export default userAuth;