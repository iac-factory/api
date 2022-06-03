/**
 * Merge params with parent params
 *
 * @private
 */

export const Merge = function (params: any, parent?: object) {
    if ( !parent || typeof parent !== "object" ) {
        return params;
    }

    const obj = { ... {}, ... parent };

    if ( !( 0 in params ) || !( 0 in parent ) ) {
        return { ... obj, ... params };
    }

    /*** @task - Evaluate if necessary */
    let i = 0;
    /*** @task - Evaluate if necessary */
    let o = 0;

    /*** @task - Evaluate if necessary */
    // determine numeric gap in params
    do {i++;} while ( i in params );

    // determine numeric gap in parent
    do {o++;} while ( o in parent );

    /*** @task - Evaluate if necessary */
    // offset numeric indices in params before merge
    for ( i--; i >= 0; i-- ) {
        params[ i + o ] = params[ i ];

        /*** @task - Evaluate if necessary */
        // create holes for the merge when necessary
        if ( i < o ) delete params[ i ];
    }

    return { ... obj, ... params };
};

export default Merge;
