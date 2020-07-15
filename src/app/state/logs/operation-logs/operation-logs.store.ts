import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { OperationLog } from './operation-log.model';

export interface OperationLogsState extends EntityState<OperationLog>, ActiveState {
  date: Date;
  range: Date[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'operationLogs' })
export class OperationLogsStore extends EntityStore<OperationLogsState, OperationLog> {
  constructor() {
    super({
      date: new Date(),
      range: [new Date(), new Date()]
    });
  }
}
