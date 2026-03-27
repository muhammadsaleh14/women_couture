import { defineConfig } from "orval";

export default defineConfig({
  womenCouture: {
    input: "../backend/openapi/openapi.json",
    output: {
      target: "./src/core/api/generated/api.ts",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/core/lib/orval-mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});
