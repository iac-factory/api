import type { Server } from "@iac-factory/api-services";

export function Middleware(server: Server) {
    const Promises = Promise.allSettled( (
        [
            import("./initialize").then( (Module) => Module.Initialize( server ) ),
            import("./body").then( (Module) => Module.Body( server ) ),
            import("./timestamp").then( (Module) => Module.Timestamp( server ) ),
            // import("./status-code").then((Module) => Module.Status(server)),
            import("./headers").then( (Module) => Module.Headers( server ) ),
            // import("./ipv4").then((Module) => Module.IP()),
            import("./user-agent").then( (Module) => Module.Agent( server ) ),
            import("./cors").then( (Module) => Module.CORS( server ) ),
            // import("./socket").then((Module) => Module.WS(server)),
            // import("./logging").then((Module) => Module.Logging(server))
            // import("./compression").then((Module) => Module.Compress(server)),
            import("./content-type").then( (Module) => Module.Set( server ) )
            // import("./open.api").then((Module) => Module.$(server))
            // import("./winston").then((Module) => Module.Apply(server))
        ]
    ) );

    return Promises;
}

void ( async () => await import("./crypto") )();