import { Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc/st/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { OperationLog } from 'src/app/state/logs/operation-logs/operation-log.model';
import { OperationLogsQuery } from 'src/app/state/logs/operation-logs/operation-logs.query';
import { OperationLogsService } from 'src/app/state/logs/operation-logs/operation-logs.service';

@UntilDestroy()
@Component({
  selector: 'app-logs-operations',
  templateUrl: 'operation-logs.component.html'
})

export class OperationLogsComponent implements OnInit {

  constructor(private operationLogsService: OperationLogsService, private operationLogsQuery: OperationLogsQuery) { }
  operationLogs$: Observable<OperationLog[]>;

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

  ngOnInit() {
    this.operationLogs$ = this.operationLogsQuery.selectAll();
    console.log(this.operationLogsQuery.getAll());
    this.operationLogsService.get().pipe(untilDestroyed(this)).subscribe({ error() { } });
  }
}
