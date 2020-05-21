import { EventEmitter, Injectable, Output } from '@angular/core';
import { ID } from '@datorama/akita';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import SURVEYS from '_mock/_surveys';
import { SeriesService } from '../series/series.service';
import { SeriesStore } from '../series/series.store';
import { SurveysStore } from './surveys.store';

@Injectable({ providedIn: 'root' })
export class SurveysService {
  constructor(private surveysStore: SurveysStore,
              private seriesStore: SeriesStore,
              private seriesService: SeriesService) { }

  @Output() surveyChanged: EventEmitter<boolean> = new EventEmitter();

  get() {
    return of(SURVEYS).pipe(
      tap(surveys => {
        this.surveysStore.set(surveys);
        this.surveysStore.setActive(surveys[0].id);
      })
    );
  }

  setActive(id: ID) {
    this.surveysStore.setActive(id);
    this.seriesStore.reset();
    this.seriesService.getSchema().subscribe(() => {
      this.surveyChanged.emit(true);
    });
  }
}
