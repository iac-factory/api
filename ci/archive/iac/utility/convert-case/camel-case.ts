import Utility from "util";
import Cryptography from "crypto";

const UUID = () => Cryptography.randomUUID( { disableEntropyCache: true } );

interface Element {
    id?: string;
}

interface Node extends Element {
    name?: string;
    parent?: Node;
    children?: Node[];
    metadata?: object;
}

const Properties = new WeakMap();

export function Abstract<Generic extends Object & { prototype: {} }>(node: Node): void {
    if ( !( this instanceof Abstract ) ) {
        return new Abstract( node );
    }

    this.id = UUID();

    const { name } = node;
    const { parent } = node;
    const { metadata } = node;

    ( name ) && Reflect.set( this, "name", name );
    ( parent ) && Reflect.set( this, "parent", parent.id );
    ( metadata ) && Reflect.set( this, "metadata", metadata );

    ( parent ) && ( ( parent.children ) && parent.children.push( this ) || Reflect.set( parent, "children", [ this ] ) );

    Properties.set( this, node );

    ( this.name ) && Reflect.set( this, Symbol.for( this.name ), Properties.get( this ) );
}

Abstract.prototype.proxy = function () {
    return new Proxy( this, {} );
};

Abstract.prototype.json = function () {
    return JSON.stringify( this.proxy(), null, 4 );
};

Abstract.prototype.walk = function () {
    const internal = new Set();
    const cycle = (node: Node) => {
        internal.add( { [ this.id ]: { ... node } } );

        if ( node.parent ) {
            cycle( node.parent );
        }
    };

    cycle( this );

    return internal;
};

void ( async () => {
    /*** $ node ${0} --debug */
    const debug = ( process.argv.includes( "--debug" ) );

    const test = async () => {
        const parent = new Abstract( { name: "root" } );

        const child = new Abstract( {
            name: "child-1",
            parent: parent
        } );

        const child2 = new Abstract( {
            name: "child-2",
            parent: parent
        } );

        const child3 = new Abstract( {
            name: "child-3",
            parent: child2
        } );

        const child4 = new Abstract( {
            name: "child-4",
            parent: child2
        } );

        console.log(
            Utility.inspect( parent, {
                colors: true,
                depth: Infinity
            } )
        );

        console.log( parent.json() );

        return void null;
    };

    ( debug ) && await test();
} )();
