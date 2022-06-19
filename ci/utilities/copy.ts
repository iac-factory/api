/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import * as FS from "fs";
import * as Path from "path";

export const Copy = (source: string, target: string, debug = false) => {
    ( debug ) && console.log("[Debug] Source", source);
    ( debug ) && console.log("   -> Target", target);

    try {
        FS.mkdirSync(target, { recursive: true });
    } catch ( exception ) {}

    const file = FS.statSync(source, { throwIfNoEntry: false })?.isFile();
    (file) && FS.copyFileSync(source, Path.join(target, Path.basename(source)), FS.constants.COPYFILE_FICLONE_FORCE | FS.constants.COPYFILE_FICLONE);
    (file) || FS.readdirSync(source, { withFileTypes: true }).forEach((element: import("fs").Dirent) => {
        const Directory = element?.isDirectory() || false;
        const Link = element?.isSymbolicLink() || false;
        const Socket = element?.isSocket() || false;
        const File = element?.isFile() || false;

        try {
            if ( Directory ) {
                Copy(Path.join(source, element.name), Path.join(target, element.name), debug);
            } else {
                FS.copyFileSync(Path.join(source, element.name), Path.join(target, element.name));
            }
        } catch ( exception ) {}
    });
};
