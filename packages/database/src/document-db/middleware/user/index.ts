/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import * as Username from "./username";
import * as Password from "./password";
import * as Authorization from "./authorize";

export module User {
    export const { Hash } = Password;
    export const { Compare } = Password;
    export const { Authorize } = Authorization;

    export const username = Username;
    export const password = Password;

    export type Hash = Password.Hash;
    export type Compare = Password.Compare;
}