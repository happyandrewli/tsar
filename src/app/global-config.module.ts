import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '@core';

import { DA_STORE_TOKEN, SessionStorageStore } from '@delon/auth';
import { AlainConfig, ALAIN_CONFIG } from '@delon/util';

const alainConfig: AlainConfig = {
  // token_send_key: 'X-DreamFactory-Session-Token', 
  // token_exp_offset: 30,
  auth: { token_invalid_redirect: true, login_url: '/passport/login', executeOtherInterceptors: false }
};

const alainProvides = [{ provide: ALAIN_CONFIG, useValue: alainConfig }, { provide: DA_STORE_TOKEN, useClass: SessionStorageStore }];

@NgModule({

})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule');
  }

  static forRoot(): ModuleWithProviders<GlobalConfigModule> {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides],
    };
  }
}
