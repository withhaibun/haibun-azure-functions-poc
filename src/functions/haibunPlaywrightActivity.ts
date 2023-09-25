import { ActivityHandler } from 'durable-functions';

import WebPlaywright from '@haibun/web-playwright';
import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js'
import DomainStorage from '@haibun/domain-storage/build/domain-storage.js';
import StorageFS from '@haibun/storage-fs/build/storage-fs.js';
import DomainWebPage from '@haibun/domain-webpage/build/domain-webpage.js';
import { TExecutorResult } from '@haibun/core/build/lib/defs.js';

export type TActionResult = { ok: true | false, batch: number, instance: number, result: Partial<TExecutorResult>, duration: number };

export const haibunPlaywrightActivity: ActivityHandler = async ({ batch, instance, content }: { batch: number, instance: number, content: string }): Promise<TActionResult> => {
    try {
    const feature = { path: '/features/test.feature', content };
    const start = new Date().getTime();
    const result = await testWithDefaults([feature], [WebPlaywright, DomainStorage, DomainWebPage, StorageFS], {
        options: { DEST: 'poc', },
        extraOptions: {
            HAIBUN_O_WEBPLAYWRIGHT_STORAGE: 'StorageFS',
        },
    });
    // fixme use timing from results
    return { ok: result.ok, batch, instance, result: { featureResults: result.featureResults, failure: result.failure }, duration: new Date().getTime() - start };
    } catch (e) {
        return { ok: false, batch, instance, result: { failure: e }, duration: 0 };
    }
};