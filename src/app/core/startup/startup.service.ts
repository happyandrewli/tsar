import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzIconService } from 'ng-zorro-antd/icon';
import { catchError, switchMap } from 'rxjs/operators';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';
import { SurveysStore } from 'src/app/state/survey/surveys.store';
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
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private surveysService: SurveysService,
    private surveysStore: SurveysStore,
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
      if (!tokenData.token || !tokenData.groupMembership) {
        this.injector.get(Router).navigateByUrl('/passport/login');
        resolve({});
        return;
      }

      const surveys = [];
      tokenData.groupMembership.forEach(group => {
        if (group === 'cn=SAS17,ou=CTO,ou=Groups,o=U.S. Census Bureau,c=US') {
          surveys.push({ id: 1, type: 'A', title: 'SAS17', description: 'Service Annual Survey', server: 'Steps 77', selected: true, databaseTable: 'sas17' });
        } else if (group === 'cn=QSS,ou=CTO,ou=Groups,o=U.S. Census Bureau,c=US') {
          surveys.push({ id: 2, type: 'Q', title: 'QSS', description: 'Quarterly Services Survey', server: 'Steps 77', selected: false, databaseTable: 'qss' });
        } else if (group === 'cn=MWTS,ou=CTO,ou=Groups,o=U.S. Census Bureau,c=US') {
          surveys.push({ id: 3, type: 'M', title: 'MWTS', description: 'Monthly Wholesale Trade Survey', server: 'Steps 79', selected: false, databaseTable: 'mwts' });
        }
      });
      surveys.push({ id: 4, type: 'A', title: 'SAS-KING', description: 'Beefed up SAS17 with a million fake records', server: 'Steps 78', selected: false, databaseTable: 'tsarpoc' });
      this.surveysStore.set(surveys);
      this.surveysStore.setActive(surveys[0].id);

      this.seriesService.getSchema()
        // .pipe(
        //   catchError((res) => {
        //     resolve(null);
        //     return [];
        //   })
        // )
        .subscribe(() => {
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
                },
                {
                  text: 'System',
                  icon: { type: 'icon', value: 'setting' },
                  children: [
                    { text: 'Logs', link: '/logs/operations' }
                    // {
                    //   text: 'Logs', children: [
                    //     { text: 'Operation Logs', link: '/logs/operations' },
                    //     { text: 'Change Logs', link: '/logs/changes' }
                    //   ]
                    // }
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
