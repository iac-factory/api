/**
 * Wrap a function
 *
 * @private
 */

// @ts-ignore
export const Wrap = function (old, fn) {
    return function proxy() {
        const args = new Array( arguments.length + 1 );

        args[ 0 ] = old;

        let i = 0, len = arguments.length;
        for ( ; i < len; i++ ) {
            args[ i + 1 ] = arguments[ i ];
        }

        // @ts-ignore
        fn.apply( this, args );
    };
};

export default Wrap;