/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

const Exit = (message = null, signal = -1) => {
    ( message ) && process.stderr.write( { chunk: "[Error]" + " " + message + "\n" } );
    process.exit( signal );
    return null;
};

export { Exit };

export default Exit;
