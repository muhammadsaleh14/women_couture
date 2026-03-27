import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { generateOpenAPIDocument } from "../src/core/openapi/generate-spec";

const outDir = join(__dirname, "..", "openapi");
const outFile = join(outDir, "openapi.json");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(generateOpenAPIDocument(), null, 2));
console.log(`Wrote ${outFile}`);
