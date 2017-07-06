import { Express } from 'express';
import { resolve, join } from 'path';
import { readdirSync } from 'fs';

/* tslint:disable: no-any */
export class JsonResponse {
    private data: any;
    constructor(data: any) {
        this.data = data;
    }
    getData(): any {
        return this.data;
    }
}

interface ControllerRoute { path: string; controller: any; action: string; }
const controllers = new Map();

/* tslint:disable-next-line: variable-name */
export const Route = (path: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (!controllers.has(target)) {
        controllers.set(target, []);
    }
    const routes: ControllerRoute[] = controllers.get(target) as ControllerRoute[];
    const route: ControllerRoute = { path, controller: target as any, action: propertyKey };
    routes.push(route);
};

export const isPromise = (result: any): result is PromiseLike<any> => result.then !== undefined;

interface ControllerInstance {
    [key: string]: () => any;
}

interface ControllerClass {
    constructor: new() => ControllerInstance;
}

export const init = (app: Express) => {
    controllers.forEach((routes: ControllerRoute[], controllerClassType: ControllerClass) => {
        const controller = new controllerClassType.constructor();
        routes.forEach(route => {
            app.get(route.path, (request, response) => {
                const result = controller[route.action]();

                if (isPromise(result)) {
                    result.then(result2 => {
                        if (result2 instanceof JsonResponse) {
                            response.json(result2.getData());
                            return;
                        }
                    });
                }

                if (result instanceof JsonResponse) {
                    response.json(result.getData());
                    return;
                }
            });
        });
    });
};

export const includeControllers = (path: string) => {
    const controllerFiles = readdirSync(resolve(path));
    for (const controllerFile of controllerFiles) {
        if (!controllerFile.endsWith('js')) {
            continue;
        }
        /* tslint:disable-next-line:no-require-imports */
        require(join(path, controllerFile));
    }
};