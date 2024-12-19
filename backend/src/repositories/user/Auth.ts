import { IAuthRepository } from "../../interfaces/user/Auth.repository.interface";
import userModel, { IUser } from "../../models/userModel";
import bcrypt from "bcrypt";

export class AuthRepository implements IAuthRepository {
    async existUser(email: string): Promise<IUser | null> {
        return await userModel.findOne({ email });
    }
    async getUserById(userId: string): Promise<IUser | null> {
        return await userModel.findOne({ userId: userId });
    }
    async createUser(userData: IUser): Promise<IUser> {
        try {
            const newUser = new userModel(userData);
            return await newUser.save();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            } else {
                throw new Error("Unknown error has occured");
            }
        }
    }
    async userLoginValidate(email: string, password: string): Promise<IUser> {
        try {
            const user = await userModel.findOne(
                { email },
                {
                    _id: 0,
                    userId: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    password: 1,
                    isBlocked: 1,
                    DOB: 1,
                    gender: 1,
                }
            );

            if (!user) {
                throw new Error("User doesnt Exist");
            }

            const PassCompare = await bcrypt.compare(password, user.password);
            if (!PassCompare) {
                throw new Error("Invalid Password");
            }

            if (user.isBlocked == true) {
                throw new Error("User is blocked");
            }

            return user;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            } else {
                throw new Error("Unknown Error from UserRepositary");
            }
        }
    }
}