import { Response } from ".";

/**
 * Generate a callback that will make an OPTIONS response.
 *
 * @param {OutgoingMessage} res
 * @param {array} methods
 * @private
 */
// @ts-ignore
export const Generate = function (res, methods) {
    // @ts-ignore
    return function onDone(fn, err) {
        if ( err || methods.length === 0 ) {
            return fn( err );
        }

        Response( res, methods, fn );
    };
};

export default Generate;