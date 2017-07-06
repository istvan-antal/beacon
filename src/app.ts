import * as express from 'express';
import { argv } from 'yargs';
import { writeFileSync, unlinkSync } from 'fs';
import { includeControllers, init } from './core-mvc';

const params = argv as { [key: string]: string };

if (params.pidFile) {
    const pidFile = params.pidFile;
    writeFileSync(pidFile, process.pid);

    process.on('exit', () => {
        unlinkSync(pidFile);
    });
}

/* tslint:disable-next-line: no-require-imports no-var-requires */
require('./controllers/AppController');
includeControllers('src/controllers/');

const app = express();

const port = (process.env as { [key: string]: string }).PORT;
const DEFAULT_PORT = 16666;
const JSON_INDENTATION = 4;

app.set('port', port || DEFAULT_PORT);
app.set('json spaces', JSON_INDENTATION);

init(app);

app.listen(app.get('port'), () => {
    console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});