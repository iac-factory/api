import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, TerraformOutputConfig } from "cdktf";
import { Container, Image, DockerProvider } from "@cdktf/provider-docker";

const TF = TerraformStack;

class Stack extends TerraformStack {
    provider: DockerProvider;

    image: Image;

    container: Container;

    constructor(scope: Construct, name: string) {
        super( scope, name );

        this.provider = new DockerProvider( this, "node", {} );

        this.image = new Image( this, "node-base-image", {
            name: "node:latest",
            keepLocally: false,
            forceRemove: true
        } );

        this.container = new Container( this, "node-base-container", {
            image: this.image.latest,
            name: "node-base-container",
            entrypoint: [
                "npx", "--yes", "serve@latest", "-l", "80"
            ],
            destroyGraceSeconds: 30,
            ports: [
                {
                    internal: 80,
                    external: 8000
                }
            ]
        } );
    }
}

const Application = new App({
    skipValidation: false,
    stackTraces: true
});

const Instance = new Stack( Application, "Node-Base-Container-Instance" );

Application.synth();

export { TF, Application, Stack, Instance };

export default Instance;