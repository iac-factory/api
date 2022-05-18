/**
 * Restore obj props after function
 *
 * @private
 */

// @ts-ignore
export const Restore = function (fn, obj, ... args: any[]) {
    const props = new Array( arguments.length - 2 );
    const vals = new Array( arguments.length - 2 );

    for ( let i = 0; i < props.length; i++ ) {
        props[ i ] = arguments[ i + 2 ];
        vals[ i ] = obj[ props[ i ] ];
    }

    return function () {
        // restore vals
        for ( let i = 0; i < props.length; i++ ) {
            obj[ props[ i ] ] = vals[ i ];
        }

        // @ts-ignore
        return fn.apply( this, arguments );
    };
};

export default Restore;