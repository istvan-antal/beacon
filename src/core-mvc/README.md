# Usage

```ts
import * as express from "express";
import { init } from "core-mvc";
import './controllers/ExampleController.ts';
const app = express();
init(app);
```

controllers/ExampleController.ts
```ts
import { Route, JsonResponse } from '../core-mvc';

class ExampleController {
    @Route("/")
    public indexAction() {
        return new JsonResponse({
            success: true,
        });
    }
}
```