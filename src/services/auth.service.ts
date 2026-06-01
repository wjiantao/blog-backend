import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { HttpError } from "../utils/http-error";
import { signAccessToken } from "../utils/jwt";

export const authService = {
  async login(username: string, password: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new HttpError(401, "Invalid username or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new HttpError(401, "Invalid username or password");
    }

    const accessToken = signAccessToken({
      userId: user.id,
      username: user.username,
      role: "admin",
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  },
};
