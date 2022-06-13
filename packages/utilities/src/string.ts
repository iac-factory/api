/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Utility from "util";

export module C {
    export const printf = (options: Options, format: string, ... parameters: (object | string | number | boolean | null | Date | Symbol | RegExp | BigInt)[]) => process.stdout
        .write({ chunk: Utility.formatWithOptions( options, format, ... parameters ) });

    export const format = (format: string, ... parameters: (object | string | number | boolean | null | Date | Symbol | RegExp | BigInt)[]) => {
        return Utility.format(format, ... parameters);
    }

    export const { inspect } = Utility;

    export type Options = Utility.InspectOptions;
    export type Style = "special" | "number" | "bigint" | "boolean" | "undefined" | "null" | "string" | "symbol" | "date" | "regexp" | "module";
}

export default C;
