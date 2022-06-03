/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Client } from ".";

export const Resources = async () => {
    const configurations = await Client.Functions();

    return ( configurations ) ? configurations : null;
};

export default Resources;
