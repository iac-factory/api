const Main = async () => {
    const duration = 5000;
    const $ = async () => new Promise( async (resolve) => {
        process.stdout.write( "Awaiting ..." + "\n" );

        setTimeout( () => resolve( true ), duration );
    } );

    await $();

    process.stdout.write( "  - Complete :D" + "\n" );
};

void ( async () => Main() )();

export default Main;

export { Main };
