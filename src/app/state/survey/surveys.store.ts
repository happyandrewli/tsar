import { EntityState, StoreConfig, EntityStore, ActiveState } from '@datorama/akita';
import { Survey } from './survey.model';
import { Injectable } from '@angular/core';

export interface SurveysState extends EntityState<Survey>, ActiveState { };

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'surveys' })
export class SurveysStore extends EntityStore<SurveysState, Survey> {
  constructor() {
    super();
  }
}