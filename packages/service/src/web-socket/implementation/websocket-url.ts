/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import trailingSlash from "./trailing-slash";

/* The following fixes HenningM/express-ws#17, correctly. */
export default function websocketUrl(url: string) {
    if ( url.indexOf( "?" ) !== -1 ) {
        const [ baseUrl, query ] = url.split( "?" );

        return `${ trailingSlash( baseUrl as string ) }.websocket?${ query }`;
    }

    return `${ trailingSlash( url ) }.websocket`;
}
