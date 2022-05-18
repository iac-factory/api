import parseUrl from "parseurl";

/**
 * Get pathname of request.
 *
 * @param {IncomingMessage} req
 * @private
 */

// @ts-ignore
export const Path = function (req) {
    try {
        return parseUrl( req )?.pathname;
    } catch ( err ) {
        return undefined;
    }
};

export default Path;