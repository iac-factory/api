/**
 * Match path to a layer.
 *
 * @param {Layer} layer
 * @param {string} path
 * @private
 */

// @ts-ignore
export const Match = function (layer, path) {
    try {
        return layer.match( path );
    } catch ( err ) {
        return err;
    }
};

export default Match;