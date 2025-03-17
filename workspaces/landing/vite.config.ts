import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { config as dotenv } from 'dotenv';
const envPath = path.resolve(__dirname, '../../.env');
dotenv({ path: envPath });
const { LANDING_PORT } = process.env;

console.log('LANDING_PORT', LANDING_PORT);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(LANDING_PORT),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
