import { ActivityHandler } from 'durable-functions';

import WebPlaywright from '@haibun/web-playwright';
import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js'
import DomainStorage from '@haibun/domain-storage/build/domain-storage.js';
import StorageFS from '@haibun/storage-fs/build/storage-fs.js';
import DomainWebPage from '@haibun/domain-webpage/build/domain-webpage.js';
import { TExecutorResult } from '@haibun/core/build/lib/defs.js';

export const haibunPlaywrightActivity: ActivityHandler = async ({ batch, instance, target }: { batch: number, instance: number, target: string }): Promise<{ ok: true | false, batch: number, instance: number, result: Partial<TExecutorResult> }> => {
    const feature = { path: '/features/test.feature', content: `go to the "${target}?${batch}-${instance}" webpage` };
    const result = await testWithDefaults([feature], [WebPlaywright, DomainStorage, DomainWebPage, StorageFS], {
        options: { DEST: 'poc', },
        extraOptions: {
            HAIBUN_O_WEBPLAYWRIGHT_STORAGE: 'StorageFS',
        },
    });
    return { ok: result.ok, batch, instance, result: { featureResults: result.featureResults, failure: result.failure } };
};