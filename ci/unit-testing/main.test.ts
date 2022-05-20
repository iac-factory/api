import ".";

import { Package } from ".";

const { Testing } = Package;
const { Application } = Package;
const { Instance } = Package;

const Main = async () => {
    describe( "CDKTF Application", () => {
        describe( "Assertion(s)", () => {
            it( "Compilation", () => {
                expect( Testing.synthScope( (scope: any) => new Instance( scope, "Test" ) ) ).toBeTruthy();
            } );
        } );

        describe( "Validation", () => {
            it( "Terraform", () => {
                const $ = new Application();
                const instance = new Instance( $ );

                expect( Testing.fullSynth( instance ) ).toBeValidTerraform();

            } );
        } );

        it( "Planning", () => {
            const $ = new Application();
            const instance = new Instance( $ );

            expect( Testing.fullSynth( instance ) ).toPlanSuccessfully();
        } );
    } );
};

void ( async () => Main() )();
