import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ID } from '@datorama/akita';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DFAPI, DFAPI_KEY } from 'src/app/api';
import SURVEYS from '_mock/_surveys';
import { OperationLog } from './operation-log.model';
import { OperationLogsStore } from './operation-logs.store';

@Injectable({ providedIn: 'root' })
export class OperationLogsService {
  constructor(private operationLogsStore: OperationLogsStore, private http: HttpClient) { }

  @Output() surveyChanged: EventEmitter<boolean> = new EventEmitter();

  get() {
    let params = new HttpParams();
    params = params.append('api_key', DFAPI_KEY);
    return this.http.get<{ resource: OperationLog[] }>(`${DFAPI}/_table/logs`, { params }).pipe(
      tap(logs => {
        this.operationLogsStore.set(logs.resource);
        console.log(logs);
      })
    );
  }
}
