import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SurveysStore, SurveysState } from './surveys.store';
import { Survey } from './survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveysQuery extends QueryEntity<SurveysState, Survey> {

  constructor(protected store: SurveysStore) {
    super(store);
  }
}