import jwt from "jsonwebtoken";

export class AuthService {
    static generateAccessToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    }

    static generateRefreshToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    }

    static verifyToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }
}
