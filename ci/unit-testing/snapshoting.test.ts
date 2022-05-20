import ".";

import { Package } from ".";

const { Testing } = Package;
const { Application } = Package;
const { Instance } = Package;

const Main = async () => {
    describe( "CDKTF Application", () => {
        describe( "Snapshot", () => {
            it( "Comparator", () => {
                const $ = new Application();
                const instance = new Instance( $ );

                const snapshot = JSON.parse( Testing.synth( instance ) );

                /*** @internal Ensure secrets are not leaked */
                for ( const idx of snapshot.provider.github ) delete idx.token;

                expect( snapshot ).toMatchSnapshot();
            } );
        } );
    } );
};

void ( async () => Main() )();
