/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

/**
 * Restore obj props after function
 *
 * @private
 */

export const Restore = function (fn: Function, obj: object, ... args: any[]) {
    const props = new Array( arguments.length - 2 );
    const vals = new Array( arguments.length - 2 );

    for ( let i = 0; i < props.length; i++ ) {
        props[ i ] = arguments[ i + 2 ];

        /// @ts-ignore
        vals[ i ] = obj[ props[ i ] ];
    }

    return function (this: any) {
        // restore vals
        for ( let i = 0; i < props.length; i++ ) {
            /// @ts-ignore
            obj[ props[ i ] ] = vals[ i ];
        }

        try {
            return fn.apply( this, arguments );
        } catch ( exception ) {
            console.log(this);
        }
    };
} as Function;

export default Restore;
