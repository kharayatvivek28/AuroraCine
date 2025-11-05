import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { jsx } from "react/jsx-runtime";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.(js|jsx)$/,
    exclude: [],
  },
});
