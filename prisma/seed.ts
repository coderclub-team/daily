import { PrismaClient } from "@prisma/client";
import users from "../src/mock-data/users.json";
import cats from "../src/mock-data/categories.json";
import products from "../src/mock-data/products.json";
import slots from "../src/mock-data/slots.json";
import preferences from "../src/mock-data/preferences.json";

const prisma = new PrismaClient();
async function main() {
  const hub = await prisma.hub.create({
    data: {
      name: "chennai south",
    },
  });

  const customers = await prisma.customer.createMany({
    data: users.map((user: any) => ({ ...user, hub_id: hub.id })),
  });

  const categories = await prisma.productCategory.createMany({
    data: cats,
  });
  // create products
  products.forEach(async (product: any) => {
    if (product.type === "SIMPLE") {
      await prisma.product.create({
        data: product,
      });
    } else if (product.type === "VARIABLE") {
      await prisma.product.create({
        data: product,
        include: {
          variations: true,
        },
      });
    }
  });

  await prisma.deliveryTimeSlot.createMany({
    data: slots,
  });
  await prisma.deliveryPreference.createMany({
    data: preferences,
  }); 
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
