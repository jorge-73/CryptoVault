import { prisma } from '../config/prisma.js';

beforeEach(async () => {
  await prisma.favorite.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
