import { env } from "./env";
import { createApp } from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  await prisma.$connect();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
