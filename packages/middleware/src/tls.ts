import FS from "fs";
import Path from "path";
import Process from "process";

const CWD = Process.cwd();

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    namespace: [ "Middleware", "yellow" ],
    module: [ "Body-Parser", "green" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

const Files = {
    Key: Path.join(CWD, "configuration", "Development.key"),
    Certificate: Path.join(CWD, "configuration", "Development.crt")
};

const Content = {
    Key: FS.readdirSync(Files.Key),
    Certificate: FS.readdirSync(Files.Certificate)
};

export { Files, Content };

export default { Files, Content };
