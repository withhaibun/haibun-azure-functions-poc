import { ActivityHandler } from 'durable-functions';

import WebPlaywright from '@haibun/web-playwright';
import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js'
import DomainStorage from '@haibun/domain-storage/build/domain-storage.js';
import DomainWebPage from '@haibun/domain-webpage/build/domain-webpage.js';

export const haibunFunctionPoc: ActivityHandler = async ({ batch, instance }: { batch: number, instance: number }): Promise<{ ok: true | false, batch: number, instance: number }> => {
    const feature = { path: '/features/test.feature', content: `go to the "http://localhost:9023/test.html?${batch}-${instance}" webpage` };
    const result = await testWithDefaults([feature], [WebPlaywright, DomainStorage, DomainWebPage], {
        options: { DEST: 'no', },
        extraOptions: {
            HAIBUN_O_WEBPLAYWRIGHT_STORAGE: 'DomainStorage',
        },
    });
    return { ok: result.ok, batch, instance };
};
