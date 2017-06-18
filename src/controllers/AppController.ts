import { Route, JsonResponse } from "../core-mvc";
import {
    hostname,
    arch,
    cpus,
    platform,
    type,
    release,
    uptime,
    loadavg,
    freemem,
    totalmem,
} from "os";
import { existsSync } from "fs";
import { exec } from "child_process";

let sensorType: string;

if (platform() === "darwin") {
    sensorType = "macos";
}

if (!sensorType) {
    if (existsSync("/usr/bin/vcgencmd")) {
        sensorType = "linux";
    }
}

const fetchCpuTemp = () => new Promise((resolve, reject) => {
    if (!sensorType) {
        reject(new Error("No supported sensor type"));
    }

    let command;

    if (sensorType === "macos") {
        command = "macos-cpu-temp";
    }

    if (sensorType === "linux") {
        command = "/usr/bin/vcgencmd measure_temp  | cut -d\"=\" -f 2 | cut -d\"'\" -f 1";
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(+(stdout.trim()));
    });
});

class AppController {
    @Route("/")
    public indexAction() {
        return fetchCpuTemp().then(cpuTemperature => new JsonResponse({
            hostname: hostname(),
            arch: arch(),
            platform: platform(),
            type: type(),
            release: release(),
            uptime: uptime(),
            loadavg: loadavg(),
            cpuTemperature: cpuTemperature,
            freemem: freemem(),
            totalmem: totalmem(),
            cpus: cpus(),
        }));
    }
}