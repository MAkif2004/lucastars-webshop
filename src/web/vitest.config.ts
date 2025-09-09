import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
    ],
    test: {
        setupFiles: [
            "tests/__setup__/vitest.setup.ts",
        ],
        reporters: [
            "default",
            "junit"
        ],
        outputFile: "../../dist/junit-web.xml",
        coverage: {
            include: ["src/**"],
            provider: "istanbul",
            reporter: ["text", "text-summary", "html", "cobertura"],
            reportsDirectory: "../../dist/web-coverage",
        },
        environment: "jsdom",
    },
});
