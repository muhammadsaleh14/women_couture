"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const app_1 = require("./app");
const prisma_1 = require("./core/database/prisma");
async function main() {
    await prisma_1.prisma.$connect();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        console.log(`Server listening on http://localhost:${env_1.env.PORT}`);
    });
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map