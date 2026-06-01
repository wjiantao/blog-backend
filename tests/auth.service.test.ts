import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/user.repository", () => ({
  userRepository: {
    findByUsername: vi.fn(),
  },
}));

import bcrypt from "bcryptjs";
import { authService } from "../src/services/auth.service";
import { userRepository } from "../src/repositories/user.repository";

const mockedUserRepository = vi.mocked(userRepository);

describe("authService.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns accessToken for valid credentials", async () => {
    const hash = await bcrypt.hash("secret123", 10);
    mockedUserRepository.findByUsername.mockResolvedValue({
      id: 1,
      username: "admin",
      passwordHash: hash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.login("admin", "secret123");

    expect(result.accessToken).toBeTruthy();
    expect(result.user.username).toBe("admin");
  });

  it("throws on invalid password", async () => {
    const hash = await bcrypt.hash("secret123", 10);
    mockedUserRepository.findByUsername.mockResolvedValue({
      id: 1,
      username: "admin",
      passwordHash: hash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(authService.login("admin", "wrong")).rejects.toThrow("Invalid username or password");
  });
});
