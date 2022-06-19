import { Exists } from "./existence";
import { Reader } from "./descriptors";
import type { Handler } from "./handler";

declare module Module {
    export { Handler };
}

declare abstract class Abstract {
    Exists: typeof Exists;
}

class Interface implements Abstract {
    Exists = Exists;
    Reader = Reader;
}

export const Directory = new Interface();

export default Directory;