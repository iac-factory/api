const Exit = ( message = null, signal = -1 ) => {
    ( message ) && process.stderr.write( "[Error]" + " " + message + "\n" );
    process.exit( signal );
    return null;
};

export { Exit };

export default Exit;
