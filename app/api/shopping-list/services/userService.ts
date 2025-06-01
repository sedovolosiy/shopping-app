import { prisma } from '@/lib/db';

// User service for finding or creating users

export class UserService {
  async findOrCreate(identifier: string) {
    let user = await prisma.user.findUnique({ where: { identifier } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          identifier,
          preferences: { create: { language: 'en' } },
        },
      });
    }
    return user;
  }
}
