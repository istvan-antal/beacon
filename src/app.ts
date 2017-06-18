import * as express from "express";
import { argv } from "yargs";
import { writeFileSync, unlinkSync } from "fs";
import { init } from "./core-mvc";

if (argv.pidFile) {
    const pidFile = argv.pidFile;
    writeFileSync(pidFile, process.pid);

    process.on("exit", () => {
        unlinkSync(pidFile);
    });
}

import "./controllers/AppController";

const app = express();

app.set("port", process.env.PORT || 16666);
app.set("json spaces", 4);

init(app);

app.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});