import * as path from "path";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  publicDir: "/dist",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyLib",
      fileName: (format) => `vue-2-img.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "style.css") return "vue-2-img.css";
          return assetInfo.name || "";
        },
      },
    },
  },
  server: {
    open: "/example",
    watch: {
      useFsEvents: true
    },
    fs: {
      strict: false
    },
  },
});
