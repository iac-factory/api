/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export const Awaitable = async (duration: string) => {
    return new Promise( (resolve) => {
        void setTimeout( () => {
            resolve( duration );
        }, parseInt( duration ) );
    } );
};

export default Awaitable;
