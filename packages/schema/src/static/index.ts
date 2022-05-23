import * as Path from "path";

export const Schema = {
    TS: {
        name: "tsconfig",
        file: "tsconfig.json",
        description: "Typescript Configuration Schema",
        resolve: async function (): Promise<typeof import("./tsconfig.json")> {
            const configuration: typeof import("./tsconfig.json") = await import("./tsconfig.json");

            return configuration;
        }
    }
};

export default Schema;