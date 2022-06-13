import Subprocess from "child_process";
import OS from "os";
import FS from "fs";
import Path from "path";
import Process from "process";
import Assertion from "assert";
import Cryptography from "crypto";

import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, TerraformOutputConfig } from "cdktf";
import { Container, ContainerUpload, Image, DockerProvider } from "@cdktf/provider-docker";
import Distribution from "./utility/distribution";

import { Walker } from "./utility/index.js";

const TF = TerraformStack;

interface Data {
    provider: DockerProvider;

    image: Image;
    container: Container;
    uploads: ContainerUpload[];

    pwd: String | FS.PathOrFileDescriptor;
    cwd: String | FS.PathOrFileDescriptor;

    compilation: String | FS.PathOrFileDescriptor;
    package: String | FS.PathOrFileDescriptor;
    build: String | FS.PathOrFileDescriptor;
    target: String | FS.PathOrFileDescriptor;

    walker?: Walker | null;
}

class Stack extends TerraformStack implements Data {
    provider: DockerProvider;

    image: Image;
    container: Container;
    uploads: ContainerUpload[];

    pwd: String | FS.PathOrFileDescriptor;
    cwd: String | FS.PathOrFileDescriptor;

    compilation: String | FS.PathOrFileDescriptor;
    package: String | FS.PathOrFileDescriptor;
    build: String | FS.PathOrFileDescriptor;
    target: String | FS.PathOrFileDescriptor;

    walker?: Walker | null;

    static application: string = Path.join( Path.sep, "application" );

    constructor(scope: Construct, name: string) {
        super( scope, name );

        this.provider = new DockerProvider( this, "node", {} );

        this.image = new Image( this, "node-react-image", {
            name: "node:latest",
            keepLocally: false,
            forceRemove: true
        } );

        this.pwd = Process.cwd();

        this.cwd = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );

        this.compilation = Path.dirname( String( this.cwd ) );
        this.package = String( this.compilation );
        this.target = Path.join( Path.dirname( String( this.package ) ), "front-end-2" );
        this.build = Path.join( String( this.package ), "front-end-2", "build" );

        this.walker = this.distribution() || null;
        this.uploads = this.files();

        this.container = new Container( this, "node-react-container", {
            image: this.image.latest,
            name: "node-react-container",
            logDriver: (OS.platform() !== "darwin") ? "awslogs" : "local",
            logOpts: (OS.platform() !== "darwin") ? {
                "awslogs-region": "us-east-2",
                "awslogs-create-group": "true",
                "awslogs-group": "node-react-container-log-group"
            } : {},
            workingDir: Stack.application,
            entrypoint: [
                "npx", "--yes", "serve@latest", "-l", "80", "."
            ], upload: this.uploads,
            destroyGraceSeconds: 30,
            ports: [
                {
                    internal: 80,
                    external: 8080
                }
            ]
        } );
    }

    /*** Do not pass user-input into shell-related commands */
    compile() {
        Process.chdir( String( this.target ) );

        const $ = [
            Subprocess.spawnSync( "npm install --quiet --no-funding", { stdio: "inherit", shell: true } ),
            Subprocess.spawnSync( "npm run build", { stdio: "inherit", shell: true } )
        ];

        return $;
    }

    distribution() {
        this.compile();

        Process.chdir( Path.dirname( String( this.target ) ) );

        const descriptor = new Walker( String( this.target ), [], false );

        descriptor.copy( String( this.build ), String( this.target ) );

        Process.chdir( String( this.pwd ) );

        descriptor.accumulate( String( this.target ) );

        return descriptor;
    }

    /***
     * Distribution File(s) + Checksum Hashes
     *
     * The following function will iterate all the target files scheduled for
     * upload, take each file's contents and generate a unique checksum using the
     * same hashing algorithm used in `git, and return a docker-compatible, stateful
     * list of Container-Upload types.
     *
     */

    files() {
        // @ts-ignore
        const uploads: ContainerUpload[] = this.walker.compilations.map( ($) => {
            const hash = Cryptography.createHash( "sha1" );
            const relative = Path.join( String( this.target ) );
            const target = String( $ ).replace( relative, Stack.application );

            const buffer = FS.readFileSync( $ );
            hash.update( buffer );
            const checksum = hash.digest().toString( "base64" );

            /// Base64 encoding + SHA-1 is among the fastest Hashing Combinations
            /// Sha-1 is also what's used to compute hashes for `git` file commits

            Assertion.equal( FS.existsSync( String( $ ) ), true );

            return {
                file: Path.join( target ),
                source: String( $ ),
                sourceHash: checksum
            };
        } );

        return uploads;
    }
}

console.log(await Walker.directory("./test-directory"));

//const Application = new App( {
//    skipValidation: false,
//    stackTraces: true
//} );
//
//const Instance = new Stack( Application, "Node-React-Container-Instance" );
//
//Application.synth();
//
//export { TF, Application, Stack, Instance };
//
//export default Instance;

export default {};