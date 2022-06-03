/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS from "fs";
import Path from "path";
import Process from "process";
import { Debugger } from "@iac-factory/api-core";

const CWD = Process.cwd();

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Body-Parser", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

const Files = {
    Key: Path.join( CWD, "configuration", "Development.key" ),
    Certificate: Path.join( CWD, "configuration", "Development.crt" )
};

const Content = {
    Key: FS.readdirSync( Files.Key ),
    Certificate: FS.readdirSync( Files.Certificate )
};

export { Files, Content };

export default {
    Files,
    Content
};
