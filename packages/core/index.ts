/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export * from "./src";

import Debugger from "./src";

import("@iac-factory/ecma");

void ( async () => import("./src") )();

export default Debugger;
