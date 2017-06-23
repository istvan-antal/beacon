import { Route, JsonResponse } from '../core-mvc';
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
} from 'os';
import CpuTemperature from '../sources/CpuTemperature';

const cpuTemperatureSensor = new CpuTemperature();

export class AppController {
    @Route('/')
    async indexAction() {
        const cpuTemperature = await cpuTemperatureSensor.fetchCpuTemp();
        return new JsonResponse({
            hostname: hostname(),
            arch: arch(),
            platform: platform(),
            type: type(),
            release: release(),
            uptime: uptime(),
            loadavg: loadavg(),
            cpuTemperature,
            freemem: freemem(),
            totalmem: totalmem(),
            cpus: cpus(),
        });
    }
}