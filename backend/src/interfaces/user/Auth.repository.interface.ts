import { IUser } from "../../models/userModel";


export interface IAuthRepository {

    existUser(email: string): Promise<IUser | null>;
    getUserById(userId: string): Promise<IUser | null>;
    createUser(userData: IUser): Promise<IUser>;
    userLoginValidate(email: string, password: string): Promise<IUser | null>;

};