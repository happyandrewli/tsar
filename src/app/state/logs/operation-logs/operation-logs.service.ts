import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ID } from '@datorama/akita';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DFAPI, DFAPI_KEY } from 'src/app/api';
import SURVEYS from '_mock/_surveys';
import { SurveysQuery } from '../../survey/surveys.query';
import { OperationLog } from './operation-log.model';
import { OperationLogsStore } from './operation-logs.store';

@Injectable({ providedIn: 'root' })
export class OperationLogsService {
  constructor(private operationLogsStore: OperationLogsStore, private http: HttpClient, private surveysQuery: SurveysQuery) { }

  get(date: Date) {
    let params = new HttpParams();
    let dfParams = '';
    if (date) {
      dfParams += 'timestamp contains ' + `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    if (dfParams) {
      params = params.append('filter', dfParams);
    }
    const headers = { 'X-DreamFactory-Api-Key': DFAPI_KEY };
    params = params.append('order', 'timestamp desc');
    return this.http.get<{ resource: OperationLog[] }>(`${DFAPI}/_table/${this.surveysQuery.getActive().databaseTable}logs`, { params, headers }).pipe(
      tap(logs => {
        this.operationLogsStore.set(logs.resource);
      })
    );
  }

  updateDate(date: Date) {
    this.operationLogsStore.update({ date });
  }
  updateRange(range: Date[]) {
    this.operationLogsStore.update({ range });
  }
}
