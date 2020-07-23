import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { ID } from '@datorama/akita';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SeriesService } from 'src/app/state/series/series.service';
import { Survey } from 'src/app/state/survey/survey.model';
import { SurveysQuery } from 'src/app/state/survey/surveys.query';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html'
})
export class SeriesComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private message: NzMessageService,
              private surveysQuery: SurveysQuery, private surveysService: SurveysService,
              private seriesService: SeriesService) { }

  tabs: any[] = [
    { key: 'tview', tab: 'Table View' },
    { key: 'gview', tab: 'Graph View' }
  ];

  surveys$: Observable<Survey[]>;
  activeSurvey$: Observable<Survey>;

  pos = 0;
  private router$: Subscription;
  ngOnDestroy(): void {
    this.router$.unsubscribe();
    this.seriesService.resetSearchTerm.emit(true);
  }
  ngOnInit(): void {
    this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
    this.setActive();

    this.surveys$ = this.surveysQuery.selectAll();
    this.activeSurvey$ = this.surveysQuery.selectActive();
  }

  setActiveSurvey(id: ID) {
    this.surveysService.setActive(id);
    this.message.create('success', `${this.surveysQuery.getActive().title} is selected as your default survey.`);
  }
  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) {
      this.pos = idx;
    }
  }
  to(item: any) {
    this.router.navigateByUrl(`/series/${item.key}`);
  }
}
