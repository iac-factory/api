/**
 * Wrap a function
 *
 * @private
 */

export function Wrap(old: () => any, fn: { (fn: any, err: any): any; apply?: any; }) {
    return function proxy(this: any) {
        const args = new Array( arguments.length + 1 );

        args[ 0 ] = old;

        let i = 0, len = arguments.length;
        for ( ; i < len; i++ ) {
            args[ i + 1 ] = arguments[ i ];
        }

        fn.apply( this, args );
    };
};

export default Wrap;
