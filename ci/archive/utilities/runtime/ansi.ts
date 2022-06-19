/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

/***
 * Control characters in Unicode are at codepoints
 * - U+0000 through U+001F
 * - U+007F through U+009F
 */

import Utility from "util";

export const Strip = Utility.stripVTControlCharacters;
export default Strip;