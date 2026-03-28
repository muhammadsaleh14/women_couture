import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { openAPIRegistry } from "./registry";
import "../../modules/auth/openapi.paths";
import "../../modules/common/openapi.paths";
import "../../modules/home-hero/openapi.paths";
import "../../modules/product/openapi.paths";
import "../../modules/variant/openapi.paths";

function serverPort(): number {
  const raw = process.env.PORT;
  if (raw === undefined || raw === "") {
    return 3000;
  }
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 3000;
}

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(openAPIRegistry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Women Couture API",
      version: "0.1.0",
      description: "REST API for Women Couture",
    },
    servers: [
      {
        url: `http://localhost:${serverPort()}/api/v1`,
      },
    ],
  });
}
