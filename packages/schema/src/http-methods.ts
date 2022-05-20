import HTTP from "http";

export const methods = () => {
    return HTTP.METHODS && HTTP.METHODS.map( (method) => {
        return method.toLowerCase();
    } );
};

export enum Enumeration {
    get = "get",
    post = "post",
    put = "put",
    head = "head",
    delete = "delete",
    options = "options",
    trace = "trace",
    copy = "copy",
    lock = "lock",
    mkcol = "mkcol",
    move = "move",
    purge = "purge",
    propfind = "propfind",
    proppatch = "proppatch",
    unlock = "unlock",
    report = "report",
    mkactivity = "mkactivity",
    checkout = "checkout",
    merge = "merge",
    m = "m-search",
    notify = "notify",
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    patch = "patch",
    search = "search",
    connect = "connect"
}

export const Methods = () => {
    return [
        "get",
        "post",
        "put",
        "head",
        "delete",
        "options",
        "trace",
        "copy",
        "lock",
        "mkcol",
        "move",
        "purge",
        "propfind",
        "proppatch",
        "unlock",
        "report",
        "mkactivity",
        "checkout",
        "merge",
        "m-search",
        "notify",
        "subscribe",
        "unsubscribe",
        "patch",
        "search",
        "connect"
    ];
};

export default Methods;

export type Method = keyof typeof Enumeration;
