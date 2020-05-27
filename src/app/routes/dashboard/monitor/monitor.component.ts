import { Component, OnDestroy, OnInit } from '@angular/core';
import { ID } from '@datorama/akita';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';

import { Survey } from 'src/app/state/survey/survey.model';
import { SurveysQuery } from 'src/app/state/survey/surveys.query';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@Component({
  selector: 'app-dashboard-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less']
})
export class DashboardMonitorComponent implements OnInit, OnDestroy {

  constructor(private message: NzMessageService, private surveysQuery: SurveysQuery, private surveysService: SurveysService) { }

  surveys$: Observable<Survey[]>;
  activeSurvey$: Observable<Survey>;

  recentlyViewedViz = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  salesData: any[] = [
    { x: 'Jan', y: 847 },
    { x: 'Feb', y: 394 },
    { x: 'Mar', y: 526 },
    { x: 'Apr', y: 1010 },
    { x: 'May', y: 780 },
    { x: 'Jun', y: 937 },
    { x: 'Jul', y: 751 },
    { x: 'Aug', y: 682 },
    { x: 'Sep', y: 599 },
    { x: 'Oct', y: 581 },
    { x: 'Nov', y: 680 },
    { x: 'Dec', y: 388 }
  ];
  offlineChartData: any[] = [
    { x: 1584022186419, y1: 32, y2: 74 },
    { x: 1584023986419, y1: 107, y2: 100 },
    { x: 1584025786419, y1: 42, y2: 48 },
    { x: 1584027586419, y1: 43, y2: 48 },
    { x: 1584029386419, y1: 24, y2: 76 },
    { x: 1584031186419, y1: 72, y2: 93 },
    { x: 1584032986419, y1: 96, y2: 11 },
    { x: 1584034786419, y1: 89, y2: 93 },
    { x: 1584036586419, y1: 42, y2: 78 },
    { x: 1584038386419, y1: 93, y2: 22 },
    { x: 1584040186419, y1: 78, y2: 48 },
    { x: 1584041986419, y1: 39, y2: 35 },
    { x: 1584043786419, y1: 100, y2: 13 },
    { x: 1584045586419, y1: 63, y2: 100 },
    { x: 1584047386419, y1: 54, y2: 46 },
    { x: 1584049186419, y1: 82, y2: 37 },
    { x: 1584050986419, y1: 73, y2: 88 },
    { x: 1584052786419, y1: 53, y2: 75 },
    { x: 1584054586419, y1: 96, y2: 37 },
    { x: 1584056386419, y1: 32, y2: 96 }
  ];

  ngOnInit() {
    this.surveys$ = this.surveysQuery.selectAll();
    this.activeSurvey$ = this.surveysQuery.selectActive();
  }

  setActive(id: ID) {
    this.surveysService.setActive(id);
    this.message.create('success', `${this.surveysQuery.getActive().title} is selected as your default survey.`);
  }

  ngOnDestroy(): void { }
}
