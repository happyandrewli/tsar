import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SurveysQuery } from 'src/app/state/survey/surveys.query';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.component.html'
})

export class LogsComponent implements OnInit {
  constructor(private router: Router, private message: NzMessageService, private surveysQuery: SurveysQuery, private surveysService: SurveysService) { }

  tabs: any[] = [
    { key: 'operations', tab: 'Operation Logs' },
    { key: 'changes', tab: 'Change Logs' }
  ];

  pos = 0;
  private router$: Subscription;

  ngOnInit() {
    this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
    this.setActive();
  }

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) {
      this.pos = idx;
    }
  }

  to(item: any) {
    this.router.navigateByUrl(`/logs/${item.key}`);
  }
}
