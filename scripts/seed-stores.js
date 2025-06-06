// scripts/seed-stores.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding stores...");

  // Array of store objects to add
  const storeData = [
    { name: "Lidl" },
    { name: "Aldi" },
    { name: "Biedronka" },
    { name: "Auchan" },
    { name: "Carrefour" },
    { name: "Makro" },
  ];

  // Create stores one by one, skipping if they already exist
  for (const { name } of storeData) {
    const existingStore = await prisma.store.findUnique({
      where: { name },
    });

    if (!existingStore) {
      const store = await prisma.store.create({
        data: { name },
      });
      console.log(`Created store: ${store.name} (${store.id})`);
    } else {
      console.log(
        `Store already exists: ${existingStore.name} (${existingStore.id})`
      );
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding stores:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
