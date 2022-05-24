export * from "./src";
export * from "./main";

import("@iac-factory/ecma");

import { Framework } from "./main";
import { Application } from "./main";
import { Controller } from "./main";

import type { Reflection } from "./main";

export { Framework };
export { Application };
export { Controller };

export type { Reflection };

export default Application;
