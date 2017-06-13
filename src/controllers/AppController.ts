import { Route, JsonResponse } from "../core-mvc";
import { arch, cpus, platform, type, release, uptime, loadavg, totalmem } from "os";

class AppController {
    @Route("/")
    public indexAction() {
        return new JsonResponse({
            arch: arch(),
            cpus: cpus(),
            platform: platform(),
            type: type(),
            release: release(),
            uptime: uptime(),
            loadavg: loadavg(),
            totalmem: totalmem(),
        });
    }
}