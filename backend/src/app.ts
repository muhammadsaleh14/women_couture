import cors from "cors";
import express from "express";
import path from "path";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./core/middleware/error-handler";
import { generateOpenAPIDocument } from "./core/openapi/generate-spec";
import { routes } from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/openapi.json", (_req, res) => {
    res.json(generateOpenAPIDocument());
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(generateOpenAPIDocument()),
  );

  app.use(routes);

  app.use(errorHandler);

  return app;
}
