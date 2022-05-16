export const Awaitable = async (duration: string) => {
    return new Promise( (resolve) => {
        void setTimeout( () => {
            resolve( duration );
        }, parseInt(duration) );
    } );
};

export default Awaitable;
