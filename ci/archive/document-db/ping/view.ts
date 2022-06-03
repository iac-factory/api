import { Router } from "express";

import Context from "./context";

import type { Request, Response } from "express-serve-static-core";

const Controller = Router();
Controller.get( "/", async (request: Request, response: Response) => {
    const $ = new URLSearchParams( request.url.replace( "?", "" ).replace( "/", "" ) );

    const Duration = ( $.get( "Duration" ) || $.get( "duration" ) || 1000 );

    if ( parseInt( Duration as string ) >= 60000 ) {
        console.warn( "[Utility] [Warning] Cannot Await Longer than 60 Seconds (60,000ms)" );
        response.status( 417 );
        response.send( JSON.stringify( {} ) );
    } else {
        const $ = JSON.stringify( { Duration }, null, 4 );

        await Context( ( parseInt( Duration as string ) ) );

        response.send( $ );
    }
} );

export default Controller;
