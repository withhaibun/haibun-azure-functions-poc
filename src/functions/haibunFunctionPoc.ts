import { app, HttpHandler, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions';
import { haibunPlaywrightActivity } from './haibunPlaywrightActivity.js';

const activityName = 'haibunFunctionPoc';
const target = process.env.TEST_TARGET;

const haibunFunctionPocOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
    let outputs = [];
    for (let batch = 0; batch < 2; batch++) {
        const tasks = [];
        for (let instance = 0; instance < 2; instance++) {
            tasks.push(context.df.callActivity(activityName, { batch, instance, target }));
        }
        outputs = [...outputs, yield context.df.Task.all(tasks)];
    }

    return outputs;
};
df.app.orchestration('haibunFunctionPocOrchestrator', haibunFunctionPocOrchestrator);

df.app.activity(activityName, { handler: haibunPlaywrightActivity });

const haibunFunctionPocHttpStart: HttpHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
    const client = df.getClient(context);
    const body: unknown = await request.text();
    const instanceId: string = await client.startNew(request.params.orchestratorName, { input: body });

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(request, instanceId);
};

app.http('haibunFunctionPocHttpStart', {
    route: 'orchestrators/{orchestratorName}',
    extraInputs: [df.input.durableClient()],
    handler: haibunFunctionPocHttpStart,
});

