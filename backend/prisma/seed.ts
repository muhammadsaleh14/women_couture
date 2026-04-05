/** Run with `npm run db:seed` or `npx tsx prisma/seed.ts` — not `node` (TS + import paths). */
import bcrypt from "bcrypt";
import "dotenv/config";
import { prisma } from "../src/core/database/prisma";

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    create: {
      username,
      passwordHash: hash,
      role: "ADMIN",
    },
    update: {
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  console.log(`Seeded admin user "${username}"`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
