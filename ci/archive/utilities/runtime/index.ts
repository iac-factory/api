/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export * from "./install";
export * from "./remove";
export * from "./copy";
export * from "./ansi";

export default async () => {
    const { Handler } = await import("./tty");
    const { Install } = await import("./install");
    const { Remove } = await import("./remove");

    await Handler();

    await Remove("node_modules");

    /*** @external {Install} */
    await Install();

    return void process.nextTick(process.exit);
}
