import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { I18NService } from '../i18n/i18n.service';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve) => {
      const tokenData = this.tokenService.get();
      if (!tokenData.token) {
        this.injector.get(Router).navigateByUrl('/passport/login');
        resolve({});
        return;
      }
      zip(this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`), this.httpClient.get('assets/tmp/app-data.json'))
        .pipe(
          catchError((res) => {
            console.warn(`StartupService.load: Network request failed`, res);
            resolve(null);
            return [];
          }),
        )
        .subscribe(
          ([langData, appData]) => {
            // setting language data
            this.translate.setTranslation(this.i18n.defaultLang, langData);
            this.translate.setDefaultLang(this.i18n.defaultLang);

            const app: any = {
              name: `ng-alain`,
              description: `Ng-zorro admin panel front-end framework`
            };
            const user: any = {
              avatar: './assets/tmp/img/avatar.jpg',
              token: tokenData.session_token,
              sessionId: tokenData.session_id,
              name: tokenData.name,
              email: tokenData.email,
              id: tokenData.id,
              time: tokenData.last_login_date,
              firstName: tokenData.first_name,
              lastName: tokenData.last_name,
              host: tokenData.host,
              isSysAdmin: tokenData.is_sys_admin,
              isRootAdmin: tokenData.is_root_admin
            };
            // application data
            const res: any = appData;
            // Application information: including site name, description, year
            this.settingService.setApp(app);
            // User information: including name, avatar, email address
            this.settingService.setUser(user);
            // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
            this.aclService.setFull(true);
            // Menu data, https://ng-alain.com/theme/menu
            this.menuService.add([
              {
                text: 'Main Navigation',
                group: true,
                children: [
                  {
                    text: 'Dashboard',
                    icon: 'anticon-dashboard',
                    children: [
                      { text: 'monitor', link: '/dashboard/monitor' },
                      { text: 'analysis', link: '/dashboard/analysis' }
                    ]
                  },
                  {
                    text: 'Series',
                    icon: { type: 'icon', value: 'history' },
                    children: [
                      { text: 'Table View', link: '/series/tview' },
                      { text: 'Graph View', link: '/series/gview' }
                    ]
                  }
                ]
              }
            ]);
            // Can be set page suffix title, https://ng-alain.com/theme/title
            this.titleService.default = '';
            this.titleService.suffix = res.app.name;
          },
          () => { },
          () => {
            resolve(null);
          },
        );
    });
  }
}
