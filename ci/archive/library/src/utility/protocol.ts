/**
 * Get get protocol + host for a URL.
 *
 * @param {string} url
 * @private
 */

// @ts-ignore
export const Protocol = function (url) {
    if ( typeof url !== "string" || url.length === 0 || url[ 0 ] === "/" ) {
        return undefined;
    }

    const searchIndex = url.indexOf( "?" );
    const pathLength = searchIndex !== -1
        ? searchIndex
        : url.length;

    const fqdnIndex = url.substring( 0, pathLength ).indexOf( "://" );

    return fqdnIndex !== -1
        ? url.substring( 0, url.indexOf( "/", 3 + fqdnIndex ) )
        : undefined;
};

export default Protocol;