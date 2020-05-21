import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzIconService } from 'ng-zorro-antd/icon';
import { catchError, switchMap } from 'rxjs/operators';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private surveysService: SurveysService,
    private seriesService: SeriesService,
    private titleService: TitleService,
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

      this.surveysService.get().pipe(
        switchMap(() => this.seriesService.getSchema()),
        catchError((res) => {
          console.warn(`StartupService.load: Network request failed`, res);
          resolve(null);
          return [];
        })
      ).subscribe(() => {
        // Application information: including site name, description, year
        this.settingService.setApp({
          name: `tsar`,
          description: `Ng-zorro admin panel front-end framework`
        });
        // User information: including name, avatar, email address
        this.settingService.setUser({
          avatar: './assets/tmp/img/avatar.jpg',
          name: tokenData.name,
          email: tokenData.email
        });
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
        this.titleService.suffix = 'tsar';
      },
        () => { },
        () => {
          resolve(null);
        });
    });
  }
}
