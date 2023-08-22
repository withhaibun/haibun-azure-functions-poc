import { ActivityHandler } from 'durable-functions';
import { chromium } from 'playwright-core';

export const haibunPlaywrightActivity: ActivityHandler = async ({ batch, instance, target }: { batch: number, instance: number, target: string }): Promise<{ ok: true | false, batch: number, instance: number }> => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const now = Date.now();
    await page.goto(`${target}?${batch}-${instance}-${now}`);
    await browser.close();
    return { ok: true, batch, instance };
};