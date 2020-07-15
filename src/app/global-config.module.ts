import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '@core';

import { AlainConfig, ALAIN_CONFIG } from '@delon/util';

const alainConfig: AlainConfig = {
  // token_send_key: 'X-DreamFactory-Session-Token', 
  auth: { login_url: '/passport/login' }
};

const alainProvides = [{ provide: ALAIN_CONFIG, useValue: alainConfig }];

@NgModule({

})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides],
    };
  }
}
