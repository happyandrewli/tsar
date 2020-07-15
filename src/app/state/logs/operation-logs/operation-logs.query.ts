import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OperationLog } from './operation-log.model';
import { OperationLogsState, OperationLogsStore } from './operation-logs.store';

@Injectable({
  providedIn: 'root'
})
export class OperationLogsQuery extends QueryEntity<OperationLogsState, OperationLog> {
  selectDate$ = this.select('date');
  selectRange$ = this.select('range');

  get date() {
    return this.getValue().date;
  }

  get range() {
    return this.getValue().range;
  }

  constructor(protected store: OperationLogsStore) {
    super(store);
  }
}
