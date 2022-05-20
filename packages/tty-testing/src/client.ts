const fs = require( "fs" );
const path = require( "path" );
const { execSync } = require( "child_process" );

/**
 * executes a command line function
 * @param {string} command
 * @returns
 * @public
 */
const execSyncWrapper = (command: string) => {
    let stdout = null;
    try {
        stdout = execSync( command ).toString().trim();
    } catch ( error ) {
        console.error( error );
    }
    return stdout;
};

/**
 * Its the main function
 * @public
 */
const main = () => {
    let gitBranch = execSyncWrapper( "git rev-parse --abbrev-ref HEAD" );
    let gitCommitHash = execSyncWrapper( "git rev-parse --short=7 HEAD" );

    const obj = {
        gitBranch,
        gitCommitHash
    };

    /***
     * Dangerous as Path.resolve() doesn't validate existing folder structure.
     *
     * Terraform suggests all source file(s) to be written at the repository root level, and when
     * necessary, such as when working with modules, to nest inside of a `./modules` directory; when working
     * with external projects or repositories, assuming terraform is the default root, it's then elected to
     * store any remote clones into a consistent, deterministic relative folder (I usually elect to clone
     * into ("./archive" || "./artifact") ).
     *
     * The motivation of course behind using the same target local clone directory for all pipelines is reuse.
     *
     * Therefore, in order to correctly resolve a node.js relative directory at runtime, rather than implementing
     * assuming the process.cwd() will always stay the same, we can use lifecycle relative pathing (__filename or __dirname);
     * for ESM-related node/javascript runtimes, the equivalent is import.meta.url.
     *
     * @example
     * /// Runtime Lifecycle Path := "$(npm root)/src/gitInfo.js"
     * /// Runtime CWD := dirname "$(npm root)/src
     * /// >>> CWD === __dirname
     *
     * const filePath = path.resolve( __dirname, "generatedGitInfo.json" );
     *
     * @type {string}
     */
    const filePath = path.resolve( __dirname, "generatedGitInfo.json" );
    const fileContents = JSON.stringify( obj, null, 2 );

    fs.writeFileSync( filePath, fileContents );
    console.log( `Wrote the following contents to ${ filePath }\n${ fileContents }` );
};

module.exports.main = main;
module.exports.default = main;

void main();

export {};
