import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@UntilDestroy()
@Component({
  selector: 'app-series-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less']
})
export class FiltersComponent implements OnInit, OnDestroy {

  filters = new FormGroup({
    tables: new FormControl(),
    view: new FormControl(),
    itemTypes: new FormControl()
  });

  from = new FormControl();
  to = new FormControl();
  statPeriods$: Observable<string[]>;
  views: string[] = [];

  constructor(private seriesService: SeriesService, private seriesQuery: SeriesQuery, private surveysService: SurveysService) { }


  ngOnInit() {

    this.filters.patchValue(this.seriesQuery.filters);

    this.from.setValue(this.seriesQuery.from);
    this.to.setValue(this.seriesQuery.to);

    this.statPeriods$ = this.seriesQuery.selectValHeaders$;

    this.seriesService.getSeriesViews().subscribe(views => {
      this.views = views;
      this.views.push('BOTH');
    });

    this.surveysService.surveyChanged.pipe(
      switchMap(() => {
        return this.seriesService.getSeriesViews();
      }), untilDestroyed(this)).subscribe((views) => {
        this.views = views;
        this.views.push('BOTH');
        this.filters.patchValue(this.seriesQuery.filters);
        this.from.setValue(this.seriesQuery.from);
        this.to.setValue(this.seriesQuery.to);
      });

    this.filters.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(filters => {
      this.seriesService.updateFilters(filters);
    });

    this.from.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(from => {
      this.seriesService.updateFrom(from);
    });

    this.to.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(to => {
      this.seriesService.updateTo(to);
    });
  }

  ngOnDestroy() { }

  disabledStartDate = (startValue: string): boolean => {
    if (!startValue || !this.to.value) {
      return false;
    }
    return startValue > this.to.value;
  }
  disabledEndDate = (endValue: string): boolean => {
    if (!endValue || !this.from.value) {
      return false;
    }
    return endValue < this.from.value;
  }
}
