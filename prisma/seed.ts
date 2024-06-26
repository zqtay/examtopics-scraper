import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tables = ["Settings"];

const settings = [
  {
    name: "scraper",
    value: { 
      access: "public",
      whitelistPaths: ["assets"],
      allowedRoles: ["admin"],
    },
  },
];

async function main() {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    console.log("Clear data in tables");
    await clearData(tx);
    console.log("Insert seed data to database");
    await seedData(tx);
  },
    {
      timeout: 60000
    });
}

async function clearData(tx: Prisma.TransactionClient) {
  for (const table of tables) {
    // Clear table
    const query = `TRUNCATE TABLE "public"."${table}" RESTART IDENTITY;`;
    await tx.$queryRaw(Prisma.sql`${Prisma.raw(query)}`);
    console.log(query);
  }
}

async function seedData(tx: Prisma.TransactionClient) {
  let results;
  results = await tx.settings.createMany({
    data: settings
  });
  console.log(`${results.count} records created in Settings`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
