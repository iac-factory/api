/**
 * Try to send an OPTIONS response.
 *
 * @private
 */
import { Send } from ".";

// @ts-ignore
export const Response = function (res, methods, next) {
    try {
        Send( res, methods );
    } catch ( err ) {
        next( err );
    }
};

export default Response;