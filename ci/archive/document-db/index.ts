import { Router } from "express";

import { View as Build } from "./build";
import { View as General } from "./general";
// import { View as Ping } from "./ping";
import { View as Status } from "./status";

const Controller = Router();

export { Connection } from "..";

Controller.all( "/build", Build );
Controller.all( "/general", General );
Controller.all( "/health", Build );
Controller.all( "/status", Status );

export { Controller };
export default Controller;

export { Process, Application, Exception, Error, Router, Library } from "..";
