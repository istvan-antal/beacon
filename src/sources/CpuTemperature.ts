import { platform } from 'os';
import { existsSync } from 'fs';
import { exec } from 'child_process';

export default class CpuTemperature {
    private sensorType: string;

    constructor() {
        if (platform() === 'darwin') {
            this.sensorType = 'macos';
        }

        if (!this.sensorType) {
            if (existsSync('/usr/bin/vcgencmd')) {
                this.sensorType = 'linux';
            }
        }
    }

    async fetchCpuTemp() {
        return new Promise((resolve, reject) => {
            if (!this.sensorType) {
                reject(new Error('No supported sensor type'));
            }

            let command = '';

            if (this.sensorType === 'macos') {
                command = './node_modules/.bin/macos-cpu-temp';
            }

            if (this.sensorType === 'linux') {
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
    }
}