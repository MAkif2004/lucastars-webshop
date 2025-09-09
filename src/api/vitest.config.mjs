import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
    ],
    test: {
        root: "./",
        setupFiles: [
            "tests/__setup__/vitest.setup.ts",
        ],
        reporters: [
            "default",
            "junit"
        ],
        outputFile: "../../dist/junit-api.xml",
        coverage: {
            include: ["src/**"],
            provider: "istanbul",
            reporter: ["text", "text-summary", "html", "cobertura"],
            reportsDirectory: "../../dist/api-coverage",
            excludeAfterRemap: true,
        },
    },
});
