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

  const heroCount = await prisma.homeHeroSlide.count();
  if (heroCount === 0) {
    await prisma.homeHeroSlide.createMany({
      data: [
        {
          sortOrder: 0,
          isActive: true,
          theme: "LIGHT",
          usePrimaryHeading: true,
          eyebrow: "New Arrivals",
          title: "Summer lawn & chiffon — fresh drops weekly",
          description:
            "Browse our unstitched and ready-to-wear pieces below.",
        },
        {
          sortOrder: 1,
          isActive: true,
          theme: "DARK",
          usePrimaryHeading: false,
          eyebrow: "2 Piece & separates",
          title: "Easy summer kurta sets",
        },
      ],
    });
    console.log("Seeded default home hero slides");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
