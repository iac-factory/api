import * as OS           from "os";
import * as Cryptography from "crypto";
import * as FS           from "fs";
import * as Path         from "path";

import { Construct }           from "constructs";
import { App, TerraformStack } from "cdktf";

import { DockerProvider, Image, Container } from "@cdktf/provider-docker";

/*** @ts-ignore */
const Uploads: typeof import("./file-descriptors.json") = require( "./file-descriptors.json" );

class Stack extends TerraformStack {
    /*** Local Development Loopback Hostname := `host.docker.internal` */
    constructor(scope: Construct, name: string) {
        super( scope, name );

        new DockerProvider( ... this.id( "docker-provider", name ), {} );

        const image = new Image( ... this.id( "docker-image", name ), {
            name: "node:alpine",
            keepLocally: false,
            forceRemove: true
        } );

        const container = new Container( ... this.id( "docker-container", name ), {
            name: "iac-api",
            /*** The ID of the image to back the container */
            image: image.latest,
            /*** If `true` attach to the container after its creation and waits the end of its execution. Defaults to `false` */
            attach: false,
            /*** If true, then the container will be automatically removed when it exits. Defaults to `false`. */
            rm: false,
            /*** Environment variables to set in the form of `KEY=VALUE`, e.g. `DEBUG=0` */
            env: [],
            /*** IPC sharing mode for the container. Possible values are: `none`, `private`, `shareable`,` container:<name|id>` or `host`. */
            ipcMode: "host",
            logDriver: ( OS.platform() !== "darwin" ) ? "awslogs" : "local",
            logOpts: ( OS.platform() !== "darwin" ) ? {
                logDriver: ( OS.platform() !== "darwin" ) ? "awslogs" : "local",
                "awslogs-region": "us-east-2",
                "awslogs-create-group": "true",
                "awslogs-group": [ name, "log-group" ].join( "-" ),
                "awslogs-stream-prefix": [ name, "stream" ].join( "-" )
            } : {},
            hostname: "localhost",
            upload: this.files(),
            ports: [
                {
                    /*** Internal Docker network listening port */
                    internal: 3000,
                    /*** The port the service will be available to the host on */
                    external: 3000
                }
            ],
            /*** Run a Privileged Container - Note that AWS Fargate Containers Cannot run Privileged */
            privileged: true,
            /*** Default Volume Clean-Up */
            removeVolumes: true,
            /*** Upon Failure or Stop, Restart the Container - Note that AWS Fargate Disregards this Option */
            restart: "no",
            /*** Allocated Memory (in MB) - Defaults to `64` */
            shmSize: 512,
            cpuShares: 1024,
            memory: 512,
            memorySwap: 1024,
            command: [ "npm", "run", "production" ],
            workingDir: "/usr/bin/iac-api"
        } );
    }

    protected id(id: string, name: string) {
        return [ this, [ name, id ].join( "-" ) ] as const;
    };

    private files = () => {
        return Uploads.filter( (element) => ( element.properties.file === true && !( element.name.includes( "map" ) ) ) ).map( (file) => {
            const directory = "/usr/bin/iac-api";

            const hash = Cryptography.createHash( "sha1" );
            const relative = Path.relative( process.cwd(), file.path );
            const buffer = FS.readFileSync( relative, { encoding: "base64" } );

            hash.update( buffer );

            const checksum = hash.digest().toString( "base64" );

            const target = Path.join( directory, relative.replace( "build", "" ) );

            return {
                /**
                 * Path to the file in the container where is upload goes to
                 *
                 * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/docker/r/container#file Container#file}
                 */
                file: target,
                /**
                 * A filename that references a file which will be uploaded as the object content. This allows for large file uploads that do not get stored in state. Conflicts with `content` & `content_base64`
                 *
                 * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/docker/r/container#source Container#source}
                 */
                source: file.path,
                /**
                 * If using `source`, this will force an update if the file content has updated but the filename has not.
                 *
                 * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/docker/r/container#source_hash Container#source_hash}
                 */
                sourceHash: checksum
            };
        } );
    }
}

const app = new App();
new Stack( app, "test" );
app.synth();
