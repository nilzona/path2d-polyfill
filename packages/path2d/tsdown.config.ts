import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  target: "node18",
  format: ["esm", "cjs"],
  dts: true,
  outExtensions({ format }) {
    return format === "es" ? { js: ".js" } : { js: ".cjs" };
  },
});

//  src/index.ts --target node18 --format esm,cjs --dts
