import * as dotenv from "dotenv";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

dotenv.config();

const processEnvCanisterIds = Object.fromEntries(
  Object.entries(process.env)
    .filter(([key]) => key.startsWith("CANISTER_ID"))
    .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
);

export default defineConfig({
  plugins: [react()],
  root: "src/react_demo_frontend",
  build: {
    target: "es2020",
    outDir: "../../dist",
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      // Proxy all http requests made to /api to the running dfx instance
      "/api": {
        target: `http://127.0.0.1:4943`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  define: {
    // Define the canister ids for the frontend to use. Currently, dfx generated
    // code relies on variables being defined as process.env.CANISTER_ID_*
    ...processEnvCanisterIds,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.DFX_NETWORK": JSON.stringify(process.env.DFX_NETWORK),
    global: "globalThis",
  },
});
