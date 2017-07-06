import { Route, JsonResponse } from '../core-mvc';
import { MachineStatusCollector } from '../status';

const statusCollector = new MachineStatusCollector();

export class AppController {
    @Route('/')
    indexAction() {
        return new JsonResponse(statusCollector.getStatus());
    }
}