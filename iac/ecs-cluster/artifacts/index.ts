import Framework, { Router } from "express";

const Server = Framework();

const Controller = Router();

Controller.get( "/", async ( request, response ) => {
    response.status( 200 ).statusMessage = "Successful";
    response.send( {
        message: "..."
    } );
} );

Controller.get( "/health-check", async ( request, response ) => {
    response.status( 200 ).statusMessage = "Successful";
    response.send( {
        message: "Hello World"
    } );
} );

Server.use( Controller );

Server.listen( process.env["package_config_port"] || 8080 );
