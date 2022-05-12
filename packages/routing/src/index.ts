const Main = async () => {
    const duration = 5000;
    void await ( async () => new Promise( (resolve) => {
        process.stdout.write( "Awaiting ..." + "\n" );

        setTimeout( () => resolve( true ), duration );
    } ) )();
};

void (async () => Main())();

export default Main;

export { Main };
