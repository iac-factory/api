
/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import TTY from "tty";

export module Cursor {
    export const hide = async (reset?: boolean): Promise<boolean | null> => new Promise((resolve) => {
        const control = "\u001B[?25l" + String((reset) ? "\r" : "");

        if (!tty()) resolve(null);
        else {
            process?.stdout?.write(control, () => resolve(true));
        }
    });

    export const show = async (): Promise<boolean | null> => new Promise((resolve) => {
        const control = "\u001B[?25h";

        if (!tty()) resolve(null);
        else {
            process?.stdout?.write(control, () => resolve(true));
        }
    });

    export const columns = () => {
        if (!tty()) return null;
        else {
            return process?.stdout?.columns ?? null;
        }
    };

    export const rows = () => {
        if (!tty()) return null;
        else {
            return process?.stdout?.rows ?? null;
        }
    };

    export const tty = () => {
        const $ = TTY.isatty(process?.stdout?.fd);

        const byte = Buffer.of().toString("utf-8");

        ($) && process.stdout.write(byte);

        return $;
    };
}

const Lock = async (): Promise<true> => new Promise(async (resolve) => {
    const count = { exit: 0 };

    const evaluate = () => (count.exit > 1) && process.nextTick(process.exit);

    TTY.isatty(process?.stdout?.fd) && (() => {
        process?.stdin?.setRawMode( true );
        process?.stdin?.on( "data", (input: Buffer) => {
            /// CTRL + C
            Buffer.from( [ 0x3 ] ).equals( input ) && (() => {
                count.exit++ && evaluate();
            })()

            /// CTRL + D
            Buffer.from( [ 0x4 ]).equals( input ) && (() => {
                count.exit++ && evaluate();
            })()

            /// CTRL + Z
            Buffer.from( [ 0x1a ] ).equals( input ) && (() => {
                count.exit++ && evaluate();
            })()
        } )
    })();

    process?.on( "exit", async () => Cursor.show() );

    resolve( true );
});

const Screen: () => Promise<void> = async () => {
    const columns = process.stdout.columns;
    const rows = process.stdout.rows;

    const tty = TTY.isatty(process?.stdout?.fd);

    /***
     * Overwrite TTY Paint from Current Cursor --> Down
     *
     * @returns {Promise<boolean>}
     */
    const overwrite = async (): Promise<void> => {
        return new Promise((resolve) => {
            if (tty) {
                Array(rows).forEach((_) => {
                    process?.stdout?.write("\n".repeat(columns));
                });

                process?.stdout?.clearScreenDown(resolve);
            } else resolve();
        });
    }

    /***
     * Reset Cursor to (0, 0)
     *
     * @returns {Promise<boolean>}
     */
    const reset = async (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (tty) {
                process?.stdout?.cursorTo(0, 0, () => resolve(true));
            } else resolve(false)
        });
    }

    await reset() && await overwrite();
};

export const Handler = async (): Promise<void> => {
    await Cursor.hide();
    await Screen();
    await Lock();
};

export default Handler;