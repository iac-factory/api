import { Contents } from "./contents";
import { Empty } from "./empty";
import { Exists } from "./existence";

import type { Handler } from "./handler";

declare module Module {
    export { Handler };
}

declare abstract class Abstract {
    Exists: typeof Exists;
    Contents: typeof Contents;
    Empty: typeof Empty;
}

class Interface implements Abstract {
    Exists = Exists;
    Contents = Contents;
    Empty = Empty;
}

export const File = new Interface();

export default File;