import { Component, OnInit } from '@angular/core';
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
  operationLogs$: Observable<OperationLog[]>;

  constructor(private operationLogsService: OperationLogsService, private operationLogsQuery: OperationLogsQuery) { }

  ngOnInit() {
    this.operationLogs$ = this.operationLogsQuery.selectAll();
    console.log(this.operationLogsQuery.getAll());
    this.operationLogsService.get().pipe(untilDestroyed(this)).subscribe({ error() { } });
  }
}
