import { Controller } from "@iac-factory/api-services";

const Router = Controller("IaC.Factory.API");

Router.use( "/:route", async (request, response, next) => next() );
Router.param( "route", (request, response, next) => {
    response.set("X-Open-API", "True");

    next();
} );

Router.get("/", async (request, response) => {
    response.status(200).send({
        message: true
    });
});

export { Router };
export default Router;

void import("./routes");