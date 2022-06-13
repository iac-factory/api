/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

const Main = async () => {
    const duration = 5000;
    const $ = async () => new Promise( async (resolve) => {
        process.stdout.write( { chunk: "Awaiting ..." + "\n" } );

        setTimeout( () => resolve( true ), duration );
    } );

    await $();

    process.stdout.write( { chunk: "  - Complete :D" + "\n" } );
};

void ( async () => Main() )();

export default Main;

export { Main };
