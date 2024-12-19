export interface IAuthService {
  verifyAdmin(
    email: string,
    password: string
  ): Promise<{
    adminInfo: { email: string };
    adminAccessToken: string;
    adminRefreshToken: string;
  }>;
}
