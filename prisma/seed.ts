// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@harvest.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@harvest.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Seed complete. Admin: admin@harvest.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
