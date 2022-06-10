/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export * from "./src";
export * from "./main";

import("@iac-factory/ecma");

import { Application } from "./main";
import { Controller } from "./main";

import type { Reflection } from "./main";

export { Application };
export { Controller };
export type { Reflection };

export default Application;
