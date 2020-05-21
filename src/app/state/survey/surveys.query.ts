import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Survey } from './survey.model';
import { SurveysState, SurveysStore } from './surveys.store';

@Injectable({
  providedIn: 'root'
})
export class SurveysQuery extends QueryEntity<SurveysState, Survey> {

  constructor(protected store: SurveysStore) {
    super(store);
  }
}
