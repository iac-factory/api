import FS from "fs";
import Path from "path";
import Process from "process";

const CWD = Process.cwd();

const Files = {
    Key: Path.join(CWD, "configuration", "Development.key"),
    Certificate: Path.join(CWD, "configuration", "Development.crt")
};

const Content = {
    Key: FS.readdirSync(Files.Key),
    Certificate: FS.readdirSync(Files.Certificate)
};

export { Files, Content };

export default { Files, Content };
