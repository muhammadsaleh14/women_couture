import { defineConfig } from "orval";

export default defineConfig({
  womenCouture: {
    input: "../backend/openapi/openapi.json",
    output: {
      target: "./src/api/generated/api.ts",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/lib/orval-mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});
