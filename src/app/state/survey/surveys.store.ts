import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Survey } from './survey.model';

export interface SurveysState extends EntityState<Survey>, ActiveState { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'surveys' })
export class SurveysStore extends EntityStore<SurveysState, Survey> {
  constructor() {
    super();
  }
}
