import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Alex',
      email: 'alex@casasola.dev',
      role: 'ADMIN'
    },
  });
  await prisma.community.create({
    data: {
      name: 'Ladera',
      parkingSpaces: 10,
      subdomain: 'ladera',
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });