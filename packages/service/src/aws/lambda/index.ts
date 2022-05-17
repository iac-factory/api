import Path from "path";

export * from "./arn";
export * from "./aws";
export * from "./hook";
export * from "./method";
export * from "./escape";
export * from "./utility";
export * from "./services";
export * from "./composer";
export * from "./construct";
export * from "./resources";
export * from "./arn-extension";

const Resolve = (filename: string, extension?: string) => Path.join( Path.dirname( __dirname ), Path.basename(filename, extension) );

export { Resolve };