import { Express } from "express";

export class JsonResponse {
    private data: any;
    constructor(data: any) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
}

interface ControllerRoute { path: string; controller: any; action: string; }
const controllers = new Map();

export function Route(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!controllers.has(target)) {
            controllers.set(target, []);
        }
        const routes: ControllerRoute[] = controllers.get(target);
        routes.push({ path, controller: target, action: propertyKey });
    };
}

function isPromise(result: any): result is PromiseLike<any> {
    return result.then !== undefined;
}

export const init = (app: Express) => {
    controllers.forEach((routes: ControllerRoute[], ControllerClass: any) => {
        const controller = new ControllerClass.constructor();
        routes.forEach(route => {
            app.get(route.path, (request, response) => {
                const result = controller[route.action]();

                if (isPromise(result)) {
                    result.then(result => {
                        if (result instanceof JsonResponse) {
                            response.json(result.getData());
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