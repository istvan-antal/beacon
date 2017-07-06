import {
    hostname, arch, cpus,
    platform, type, release, uptime,
    loadavg, freemem, totalmem,
} from 'os';
import CpuTemperature from './sources/CpuTemperature';

const UPDATE_PERIOD = 900000;

interface CpuTemperatureStat {
    temperature: number;
    time: Date;
}

interface StatusInterface {
    readonly hostname: string;
    readonly arch: string;
    readonly platform: string;
    readonly type: string;
    readonly release: string;
    readonly uptime: number;
    readonly loadavg: {};
    readonly cpuTemperature: CpuTemperatureStat[];
    readonly freemem: number;
    readonly totalmem: number;
    readonly cpus: {};
}

export class MachineStatusCollector {
    private cpuTemperatureSensor = new CpuTemperature();
    private currentStatus: StatusInterface;
    private constants = {
        arch: arch(),
        platform: platform(),
        type: type(),
        totalmem: totalmem(),
        cpus: cpus(),
    };
    private refresh: () => void;
    private cpuTemperatures: CpuTemperatureStat[] = [];
    constructor() {
        this.refresh = () => {
            this.cpuTemperatureSensor.fetchCpuTemp().then(cpuTemperature => {
                this.cpuTemperatures.push({
                    temperature: cpuTemperature,
                    time: new Date(),
                });
                this.update();
            }).catch(e => {
                console.error(e);
            });
        };

        this.refresh();
        setInterval(this.refresh, UPDATE_PERIOD);
    }
    update() {
        this.currentStatus = {
            ...this.constants,
            hostname: hostname(),
            release: release(),
            uptime: uptime(),
            loadavg: loadavg(),
            cpuTemperature: this.cpuTemperatures,
            freemem: freemem(),
        };
    }
    getStatus() {
        return this.currentStatus;
    }
}