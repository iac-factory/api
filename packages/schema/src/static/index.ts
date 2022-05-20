import * as Path from "path";

export const Schema = {
    TS: {
        name: "tsconfig",
        file: "tsconfig.json",
        description: "Typescript Configuration Schema",
        resolve: async function (): Promise<TS> {
            return import("." + Path.sep + Schema.TS.file)
        }
    }
}

export type TS = {
    [$ in keyof typeof import("./tsconfig.json")]: (typeof import("./tsconfig.json"))[$]
}

export default Schema;