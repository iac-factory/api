/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import ANSI from "ansi-colors";

export module Color {
    export const { black } = ANSI;
    export const { red } = ANSI;
    export const { green } = ANSI;
    export const { yellow } = ANSI;
    export const { blue } = ANSI;
    export const { magenta } = ANSI;
    export const { cyan } = ANSI;
    export const { white } = ANSI;
    export const { gray } = ANSI;
    export const { grey } = ANSI;

    export module bright {
        export const { blackBright: black } = ANSI;
        export const { redBright: red } = ANSI;
        export const { greenBright: green } = ANSI;
        export const { yellowBright: yellow } = ANSI;
        export const { blueBright: blue } = ANSI;
        export const { magentaBright: magenta } = ANSI;
        export const { cyanBright: cyan } = ANSI;
        export const { whiteBright: white } = ANSI;
    }
}

export module Modifiers {
    export const { reset } = ANSI;
    export const { bold } = ANSI;
    export const { dim } = ANSI;
    export const { italic } = ANSI;
    export const { underline } = ANSI;
    export const { inverse } = ANSI;
    export const { hidden } = ANSI;
    export const { strikethrough } = ANSI;
}

export module Interface {
    export const { stripColor: strip } = ANSI;
    export const { create } = ANSI;
    export const { unstyle } = ANSI;
    export const { enabled } = ANSI;
    export const { visible } = ANSI;
}


