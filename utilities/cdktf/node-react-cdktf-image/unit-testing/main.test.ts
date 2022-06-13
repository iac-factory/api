import { Testing } from "cdktf";

import "cdktf/lib/testing/adapters/jest";
import { TF, Stack, Application } from "./../src/index";

/// import * as Docker from "./../.gen/providers/docker/container";

/// ==> https://cdk.tf/testing
describe( "CDKTF Docker Application Unit-Test", () => {
    /// it.todo( "@Task Example ..." );

    describe( "Unit Test Assertions", () => {
        it( "Should Contain Truthy Properties", () => {
            expect(
                Testing.synthScope( (scope) => {
                    const QA = new Stack( scope, "Unit-Testing-Stack" );
                    return (QA.image ?? null);
                } )
            ).toBeTruthy();

            expect(
                Testing.synthScope( (scope) => {
                    const QA = new Stack( scope, "Unit-Testing-Stack" );
                    return (QA.container ?? null);
                } )
            ).toBeTruthy();

            expect(
                Testing.synthScope( (scope) => {
                    const QA = new Stack( scope, "Unit-Testing-Stack" );
                    return (QA.provider ?? null);
                } )
            ).toBeTruthy();
        } );
    } );

    describe( "Terraform Generated Configuration", () => {
        it( "Doesn't Contain Malformation(s) && := Valid State", () => {
            const QA = Testing.app();
            const Stack = new TF( QA, "Terraform-Configuration-Validative-Stack" );
            expect( Testing.fullSynth( Stack ) ).toBeValidTerraform();
        } );
    });

    it( "Establishes a Successful Plan", () => {
        const Instance = new Stack( Application, "Unit-Testing-Stack-Instance" );
        expect( Testing.fullSynth( Instance ) ).toPlanSuccessfully();
    } );
} );
