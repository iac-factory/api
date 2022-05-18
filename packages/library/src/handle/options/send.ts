/**
 * Send an OPTIONS response.
 *
 * @private
 */

// @ts-ignore
export const Send = function (res, methods) {
    var options = Object.create( null );

    // build unique method map
    for ( let i = 0; i < methods.length; i++ ) {
        options[ methods[ i ] ] = true;
    }

    // construct the allow list
    var allow = Object.keys( options ).sort().join( ", " );

    // send response
    res.setHeader( "Allow", allow );
    res.setHeader( "Content-Length", Buffer.byteLength( allow ) );
    res.setHeader( "Content-Type", "text/plain" );
    res.setHeader( "X-Content-Type-Options", "nosniff" );
    res.end( allow );
};

export default Send;