import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alex',
      email: 'alex@casasola.dev',
      role: 'ADMIN'
    },
  });
  const community = await prisma.community.create({
    data: {
      name: 'Ladera',
      parkingSpaces: 10,
      subdomain: 'ladera',
    }
  });
  const house = await prisma.house.create({
    data: {
      unit: 'J5',
      Community: {
        connect: {
          id: community.id
        },
      }
    }
  });
  const tenant = await prisma.tenant.create({
    data: {
      firstName: 'Alex',
      lastName: 'Casasola',
      House: {
        connect: {
          id: house.id
        }
      },
      User: {
        connect: {
          id: user.id
        }
      }
    }
  });
  const vehicle = await prisma.vehicle.create({
    data: {
      licensePlate: 'BQV9911',
      name: 'Tesla Model 3',
    }
  });

  await prisma.housesOnVehicles.create({
    data: {
      House: {
        connect: {
          id: house.id
        }
      },
      Vehicle: {
        connect: {
          id: vehicle.id
        }
      }
    }
  });

  const now = new Date();
  const later = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  await prisma.reservation.create({
    data: {
      reservedFrom: now,
      reservedTo: later,
      Community: {
        connect: {
          id: community.id
        }
      },
      House: {
        connect: {
          id: house.id
        }
      },
      Vehicle: {
        connect: {
          id: vehicle.id
        }
      },
      Tenant: {
        connect: {
          id: tenant.id
        }
      }
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