import { IAuthRepository } from "../../interfaces/admin/Auth.repository.interface";
import adminModel from "../../models/adminModel";


export class AuthRepository implements IAuthRepository {
    async adminCheck(email: string) {
        try {
            const adminData = await adminModel.findOne({ email: email });

            if (adminData) {
                return adminData;
            }
            throw new Error("Doctor Doesn't exist");
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}