import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
    }),
    netlifyPlugin(),
    tsconfigPaths(),
  ],
});
