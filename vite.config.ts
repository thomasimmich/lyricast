import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@storybook/react"],
  },
  plugins: [
    react({
      babel: {
        plugins: [
          "babel-plugin-macros",
          [
            "@emotion/babel-plugin-jsx-pragmatic",
            {
              export: "jsx",
              import: "__cssprop",
              module: "@emotion/react",
            },
          ],
          [
            "@babel/plugin-transform-react-jsx",
            { pragma: "__cssprop" },
            "twin.macro",
          ],
        ],
      },
    }),
  ],
});
