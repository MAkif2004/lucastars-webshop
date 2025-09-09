/* eslint-disable @typescript-eslint/typedef */
import { interfacesPlugin, typecheckPlugin as interfacesTypecheckPlugin } from "@hboictcloud/esbuild-plugin-interfaces";
import typechecksPlugin from "@hboictcloud/esbuild-plugin-typechecks";

/** @type {import("@hboictcloud/esbuild-plugin-typechecks").Options} */
const typecheckOptions = {
    tsConfigPath: "./tsconfig.json",
    includePatterns: [
        "./global.d.ts",
        "./src/**/*.ts",
        "../shared/**/*.ts",
    ],
    throwOnError: false,
    plugins: [
        interfacesTypecheckPlugin(),
    ],
};

/** @type {import("@hboictcloud/esbuild-scripts").Options} */
const options = {
    entryPoints: [
        "./src/index.ts",
    ],
    outfile: "../../dist/api/index.js",
    target: "node20",
    // NOTE: Due to a bug in the @hboictcloud/esbuild-plugin-interfaces, this has to be disabled.
    minifyIdentifiers: false,
    watchPlugins: [
        typechecksPlugin(typecheckOptions),
        interfacesPlugin(),
    ],
    buildPlugins: [
        typechecksPlugin({
            ...typecheckOptions,
            throwOnError: true,
        }),
        interfacesPlugin(),
    ],
};

export default options;
