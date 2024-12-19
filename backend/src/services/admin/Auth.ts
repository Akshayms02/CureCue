import { createAdminToken, createRefreshToken } from "../../config/jwtConfig";
import { IAuthRepository } from "../../interfaces/admin/Auth.repository.interface";
import { IAuthService } from "../../interfaces/admin/Auth.service.interface";


export class AuthService implements IAuthService {
    private AuthRepository: IAuthRepository;

    constructor(AuthRepository: IAuthRepository) {
        this.AuthRepository = AuthRepository;

    };
    async verifyAdmin(
        email: string,
        password: string
    ): Promise<{
        adminInfo: { email: string };
        adminAccessToken: string;
        adminRefreshToken: string;
    }> {
        try {
            const adminData = await this.AuthRepository.adminCheck(email);
            if (adminData) {
                if (password != adminData.password) {
                    throw new Error("Password is wrong");
                }

                const adminAccessToken = createAdminToken(
                    adminData.email as string,
                    "admin"
                );

                const adminRefreshToken = createRefreshToken(
                    adminData.email as string,
                    "admin"
                );
                const adminInfo = {
                    email: adminData.email,
                };

                return {
                    adminInfo,
                    adminAccessToken,
                    adminRefreshToken,
                };
            } else {
                throw new Error("Admin Doesn't exist");
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


}