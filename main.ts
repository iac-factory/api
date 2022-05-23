import "dotenv/config";

import Dot from "dotenv";
import Expansion from "dotenv-expand";

export default ( () => {
    return Expansion.expand( Dot.config() ).parsed;
} )();
