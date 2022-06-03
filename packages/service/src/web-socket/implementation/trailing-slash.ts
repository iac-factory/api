/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export default function addTrailingSlash(string: string) {
    let suffixed = string;
    if ( suffixed.charAt( suffixed.length - 1 ) !== "/" ) {
        suffixed = `${ suffixed }/`;
    }
    return suffixed;
}
