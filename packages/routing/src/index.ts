import("./test");

import { Controller } from "@iac-factory/api-services";

export const Router = Controller();

Router.options("/", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory(__filename);

    response.status(200).send(directories);
});

Router.get("/", async (request, response) => {
    response.status(200).send({
        message: true
    });
});

export default Router;