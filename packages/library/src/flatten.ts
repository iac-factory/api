export function Flatten(list: any[], depth?: number) {
    depth = ( typeof depth == "number" ) ? depth : Infinity;

    if ( !depth ) {
        if ( Array.isArray( list ) ) {
            return list.map( function (i) { return i; } );
        }
        return list;
    }

    const flat = function (list: Array<[][]>, level: number): [][] {
        return list.reduce( function (array, item) {

            if ( ( depth ) && Array.isArray( item ) && ( level < depth! ) ) {
                return array.concat( flat( item, level + 1 ) );
            } else {
                return array.concat( item );
            }
        }, [] );
    };

    return flat( list, 1 );
}

export default Flatten;
