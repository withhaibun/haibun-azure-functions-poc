import { ActivityHandler } from 'durable-functions';

import { chromium, devices } from 'playwright';

export const haibunPlaywrightActivity: ActivityHandler = async ({ batch, instance, target }: { batch: number, instance: number, target: string }): Promise<any> => {
    const start = new Date().getTime();
    let failure;
    try {
        const browser = await chromium.launch();
        const context = await browser.newContext(devices['iPhone 11']);
        const page = await context.newPage();

        await page.goto(`${target}?${batch}-${instance}`);
    } catch (e) {
        failure = e;
        console.log('oops', e)
    }

    return { ok: true, batch, instance, failure, duration: new Date().getTime() - start };
};