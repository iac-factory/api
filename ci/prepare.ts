import Subprocess from "child_process";

Subprocess.execSync("node build", {
    cwd: process.cwd(),
    encoding: "utf-8",
    stdio: "inherit"
});

Subprocess.execSync("node read", {
    cwd: process.cwd(),
    encoding: "utf-8",
    stdio: "inherit"
});