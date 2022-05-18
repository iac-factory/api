import HTTP from "http";

export const methods = () => {
    return HTTP.METHODS && HTTP.METHODS.map( (method) => {
        return method.toLowerCase();
    } );
};

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

export type Method = typeof HTTP.METHODS;
