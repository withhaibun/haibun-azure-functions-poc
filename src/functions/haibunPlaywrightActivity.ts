import { ActivityHandler } from 'durable-functions';
import { chromium } from 'playwright-core';

export const haibunPlaywrightActivity: ActivityHandler = async ({ batch, instance }: { batch: number, instance: number }): Promise<{ ok: true | false, batch: number, instance: number }> => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const now = Date.now();
    await page.goto(`http://localhost:9023/test.html?${batch}-${instance}-${now}`); // Add the instance number if required
    await browser.close();
    return { ok: true, batch, instance };
};