import FS from "node:fs";
import Awaitable from "node:async_hooks";
import "dotenv/config";

import Dot from "dotenv";
import Expansion from "dotenv-expand";

const { fd: output } = process.stdout;
const logger = { indent: 0 };

export const Runtime = Awaitable.createHook( {
    init(asyncId: number, type: string, triggerAsyncId: number) {
        const eid = Awaitable.executionAsyncId();
        const indentation = " ".repeat( logger.indent );
        FS.writeSync( output, `${ indentation } Before: ${ asyncId }\n` );
    },
    before(asyncId: number) {
        const indentation = " ".repeat( logger.indent );
        FS.writeSync( output, `${ indentation } Before: ${ asyncId }\n` );
        logger.indent += 2;
    },
    after(asyncId: number) {
        logger.indent -= 2;
        const indentation = " ".repeat( logger.indent );
        FS.writeSync( output, `${ indentation } After: ${ asyncId }\n` );
    },
    destroy(asyncId: number) {
        const indentation = " ".repeat( logger.indent );
        FS.writeSync( output, `${ indentation } Destroy: ${ asyncId }\n` );
    }
} );

export const Debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--runtime" ) );

export const Register = () => {
    ( Debug ) && Runtime.enable();

    return true;
};

export const Hydrate = () => {
    Expansion.expand( Dot.config() ).parsed;

    return true;
};

export const Main = async () => {
    void Register() && Hydrate();

    return import("@iac-factory/api-core");
};

export default Main;

