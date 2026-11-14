import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Serves the Netlify Functions under /api/* during `npm run dev`, so the
 * enquiry form and webhook can be tested locally with the keys in .env
 * (no Netlify CLI needed). Production uses the real Netlify Functions.
 */
function devApi(): Plugin {
  const routes: Record<string, string> = {
    "/api/enquiry": "/netlify/functions/enquiry.mts",
    "/api/cal-webhook": "/netlify/functions/cal-webhook.mts",
  };
  return {
    name: "dev-netlify-functions",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv("development", process.cwd(), "");
      for (const [k, v] of Object.entries(env)) if (!(k in process.env)) process.env[k] = v;

      server.middlewares.use(async (req, res, next) => {
        const file = routes[(req.url ?? "").split("?")[0]];
        if (!file) return next();
        try {
          const mod = await server.ssrLoadModule(file);
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === "string") headers.set(k, v);
            else if (Array.isArray(v)) headers.set(k, v.join(", "));
          }
          const method = req.method ?? "GET";
          const request = new Request(`http://${req.headers.host}${req.url}`, {
            method,
            headers,
            body: method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks),
          });
          const response: Response = await mod.default(request, { ip: req.socket.remoteAddress ?? "127.0.0.1" });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.config.logger.error(`[dev-api] ${(err as Error).stack ?? err}`);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, message: "Local function error." }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), devApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
