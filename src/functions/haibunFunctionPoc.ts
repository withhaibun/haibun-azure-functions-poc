import { app, HttpHandler, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions';
import { haibunPlaywrightActivity } from './haibunPlaywrightActivity.js';

const activityName = 'haibunFunctionPoc';
const target = process.env.TEST_TARGET;

const haibunFunctionPocOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
    let outputs = [];
    const batches = 2;
    const instances = 2;
    for (let batch = 0; batch < batches; batch++) {
        const tasks = [];
        for (let instance = 0; instance < instances; instance++) {
            tasks.push(context.df.callActivity(activityName, { batch, instance, target }));
        }
        const results = yield context.df.Task.all(tasks);
        outputs = [...outputs, results];
    }

    const total = batches * instances;
    const totalDuration = outputs.reduce((a, o) => a + o[0].duration, 0);
    return [outputs, { totalDuration, total, average: totalDuration / total }];
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

