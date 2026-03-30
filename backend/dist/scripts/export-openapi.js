"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const generate_spec_1 = require("../src/core/openapi/generate-spec");
const outDir = (0, path_1.join)(__dirname, "..", "openapi");
const outFile = (0, path_1.join)(outDir, "openapi.json");
(0, fs_1.mkdirSync)(outDir, { recursive: true });
(0, fs_1.writeFileSync)(outFile, JSON.stringify((0, generate_spec_1.generateOpenAPIDocument)(), null, 2));
console.log(`Wrote ${outFile}`);
//# sourceMappingURL=export-openapi.js.map