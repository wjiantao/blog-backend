import { prisma } from "../lib/prisma";

export const userRepository = {
  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },
};
