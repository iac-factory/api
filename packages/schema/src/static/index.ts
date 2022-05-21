import * as Path from "path";

// @ts-ignore
export { TS } from "./tsconfig.json";

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
    [$ in keyof typeof TS]: (typeof TS)[$]
}

export default Schema;