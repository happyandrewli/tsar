import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { STColumn } from '@delon/abc/st/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OperationLog } from 'src/app/state/logs/operation-logs/operation-log.model';
import { OperationLogsQuery } from 'src/app/state/logs/operation-logs/operation-logs.query';
import { OperationLogsService } from 'src/app/state/logs/operation-logs/operation-logs.service';
import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';

@UntilDestroy()
@Component({
  selector: 'app-logs-operations',
  templateUrl: 'operation-logs.component.html'
})

export class OperationLogsComponent implements OnInit, OnDestroy {

  constructor(private operationLogsService: OperationLogsService,
              private operationLogsQuery: OperationLogsQuery,
              private seriesQuery: SeriesQuery,
              private seriesService: SeriesService) { }
  operationLogs$: Observable<OperationLog[]>;
  date = new FormControl();
  range = new FormControl();

  columns: STColumn[] = [
    {
      title: 'User Name', index: 'user_name',
      sort: {
        compare: (a, b) => a.user_name - b.user_name
      }
    },
    { title: 'IP Address', index: 'ip' },
    { title: 'Time', index: 'timestamp' },
    {
      title: 'Action', index: 'method', type: 'tag', tag: {
        GET: { text: 'GET', color: 'processing' },
        POST: { text: 'POST', color: 'success' },
        PUT: { text: 'PUT', color: 'warning' },
        PATCH: { text: 'PATCH', color: 'default' },
        DELETE: { text: 'DELETE', color: 'error' }
      },
      filter: {
        menus: [{ text: 'GET', value: 'GET' }, { text: 'POST', value: 'POST' }, { text: 'PUT', value: 'PUT' }, { text: 'PATCH', value: 'PATCH' }, { text: 'DELETE', value: 'DELETE' }],
        fn: (filter, record) => !filter.value || record.method.indexOf(filter.value) !== -1
      }
    }
  ];

  today = new Date();
  ngOnDestroy(): void {
    this.seriesService.resetSearchTerm.emit(true);
  }

  ngOnInit() {
    this.operationLogs$ = this.operationLogsQuery.selectAll();

    this.date.setValue(this.operationLogsQuery.date);
    this.range.setValue(this.operationLogsQuery.range);

    combineLatest([
      this.operationLogsQuery.selectDate$,
      this.operationLogsQuery.selectRange$,
      this.seriesQuery.selectSearchTerm$])
      .pipe(switchMap(([date, range, term]) => {
        return this.operationLogsService.get(date, range, term);
      }), untilDestroyed(this)).subscribe({
        error() {
        }
      });
    this.date.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(date => {
      this.operationLogsService.updateDate(date);
    });

    this.range.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(range => {
      this.operationLogsService.updateRange(range);
    });
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, this.today) > 0;
  }
}
