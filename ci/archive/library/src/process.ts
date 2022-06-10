/**
 * Process any parameters for the layer.
 *
 * @private
 */

import { Router } from ".";

export const Processor = Router.prototype.parse = function (layer: any, called: any, req: any, res: any, done: any) {
    const params = this.params;

    // captured parameters from the layer, keys and values
    const keys = layer.keys;

    // fast track
    if ( !keys || keys.length === 0 ) {
        return done();
    }

    let i = 0;
    let name;
    let paramIndex = 0;
    let key: any;
    let paramVal: any;
    let paramCallbacks: any;
    let paramCalled: any;

    function param(err?: any): any {
        if ( err ) {
            return done( err );
        }

        if ( i >= keys.length ) {
            return done();
        }

        paramIndex = 0;
        key = keys[ i++ ];
        name = key.name;
        paramVal = req.params[ name ];
        paramCallbacks = params[ name ];
        paramCalled = called[ name ];

        if ( paramVal === undefined ) {
            return param();
        } else {
            if ( !paramCallbacks ) {
                return param();
            }
        }

        // param previously called with same value or error occurred
        if ( paramCalled && ( paramCalled.match === paramVal || ( paramCalled.error && paramCalled.error !== "route" ) ) ) {
            // restore value
            req.params[ name ] = paramCalled.value;

            // next param
            return param( paramCalled.error );
        }

        called[ name ] = paramCalled = {
            error: null,
            match: paramVal,
            value: paramVal
        };

        paramCallback();
    }

    function paramCallback(err?: any) {
        const fn = paramCallbacks[ paramIndex++ ];

        paramCalled.value = req.params[ key.name ];

        if ( err ) {
            paramCalled.error = err;
            param( err );
            return;
        }

        if ( !fn ) return param();

        try {
            fn( req, res, paramCallback, paramVal, key.name );
        } catch ( e ) {
            paramCallback( e );
        }
    }

    param();
};

export default Processor;
