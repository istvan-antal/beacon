import * as express from "express";
import { init } from "./core-mvc";

import "./controllers/AppController";

const app = express();

app.set("port", process.env.PORT || 16666);
app.set("json spaces", 4);

init(app);

app.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});