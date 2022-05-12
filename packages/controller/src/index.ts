import Express from "express";

export const Application: Server = Express();

export default Express();

export * from "./mdx";
export * from "./open-api";

export const Specification = async () => {
    return (await import("./open-api")).default;
};

import type { Application as Implementation } from "express";

export interface Server extends Implementation {}
