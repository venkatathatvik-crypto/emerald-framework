// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Served behind Nginx at /gold-emi-app/ — see [[frontend-deploy-nitro-nginx]]
  // memory: Nitro's static file server ignores this base for public/ assets,
  // so the Nginx config also needs alias blocks for /gold-emi-app/assets/ and
  // /gold-emi-app/images/ pointing at .output/public/{assets,images}/.
  vite: {
    base: "/gold-emi-app/",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
