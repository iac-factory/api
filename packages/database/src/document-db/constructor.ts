export module Constructor {
    export const string = String;
    export const number = Number;
    export const integer = BigInt;
    export const boolean = Boolean;
    export const object = Object;
}

export type Constructor = typeof Constructor;