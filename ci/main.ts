import Dot from "dotenv";
import Expansion from "dotenv-expand";

Expansion.expand( Dot.config() );

void ( async () => import("./src") )();
