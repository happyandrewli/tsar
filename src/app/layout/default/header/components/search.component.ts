import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@Component({
  selector: 'header-search',
  templateUrl: './search.component.html'
})
export class HeaderSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') {
      return;
    }
    this.searchToggled = true;
    this.focus = true;
    setTimeout(() => this.qIpt.focus(), 300);
  }

  constructor(private el: ElementRef,
              private seriesService: SeriesService,
              private seriesQuery: SeriesQuery,
              private surveysService: SurveysService) { }
  qIpt: HTMLInputElement;

  @HostBinding('class.alain-default__search-focus')
  focus = false;

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  searchControl = new FormControl();

  filteredSeriesNames: { value: string, label: string }[] = [];
  filteredSeriesNamesCount = 0;
  filteredSeriesTopics: { value: string, label: string }[] = [];
  filteredSeriesTopicsCount = 0;
  filteredSeriesNaics: { value: string, label: string }[] = [];
  filteredSeriesNaicsCount = 0;
  filteredSeriesTables: { value: string, label: string }[] = [];
  filteredSeriesTablesCount = 0;

  ngOnInit() {
    this.searchControl.patchValue(this.seriesQuery.searchTerm);
    const searchText$: Observable<string> = this.searchControl.valueChanges.pipe(
      filter(text => text.length > 2),
      debounceTime(300),
      distinctUntilChanged()
    );
    searchText$.pipe(
      switchMap(search => this.runAutoComplete(search))
    ).subscribe();

    this.surveysService.surveyChanged.pipe(untilDestroyed(this)).subscribe(() => {
      this.searchControl.setValue(this.seriesQuery.searchTerm);
    });
  }
  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input') as HTMLInputElement;
  }

  ngOnDestroy() { }
  runAutoComplete(val: string) {
    this.seriesService.getSeriesNames(val, this.seriesQuery.filters, true).subscribe(filteredNames => {
      this.filteredSeriesNames =
        // filteredNames.filter((v, i) => filteredNames.indexOf(v) === i)
        filteredNames.resource.map(fSeries => {
          return {
            value: fSeries.name, label: fSeries.name.replace(new RegExp(val, 'gi'), match => {
              return '<a target="_blank">' + match + '</a>';
            })
          };
        });
      this.filteredSeriesNamesCount = filteredNames.meta.count;
    });
    this.seriesService.getSeriesTopics(val, this.seriesQuery.filters, true).subscribe(filteredTopics => {
      this.filteredSeriesTopics = filteredTopics.resource.map(fSeries => {
        return {
          value: fSeries.topic, label: fSeries.topic.replace(new RegExp(val, 'gi'), match => {
            return '<a target="_blank">' + match + '</a>';
          })
        };
      });
      this.filteredSeriesTopicsCount = filteredTopics.meta.count;
    });
    this.seriesService.getSeriesNaics(val, this.seriesQuery.filters, true).subscribe(filteredNaics => {
      this.filteredSeriesNaics = filteredNaics.resource.map(fSeries => {
        return {
          value: fSeries.naics, label: fSeries.naics.replace(new RegExp(val, 'gi'), match => {
            return '<a target="_blank">' + match + '</a>';
          })
        };
      });
      this.filteredSeriesNaicsCount = filteredNaics.meta.count;
    });
    this.seriesService.getSeriesTables(val, this.seriesQuery.filters, true).subscribe(filteredTables => {
      this.filteredSeriesTables = filteredTables.resource.map(fSeries => {
        return {
          value: fSeries.tbl, label: fSeries.tbl.replace(new RegExp(val, 'gi'), match => {
            return '<a target="_blank">' + match + '</a>';
          })
        };
      });
      this.filteredSeriesTablesCount = filteredTables.meta.count;
    });
    return val;
  }


  qFocus() {
    this.focus = true;
  }

  qBlur(value) {
    this.focus = false;
    this.searchToggled = false;
    this.seriesService.updateSearchTerm(value);
  }

  search(event) {
    event.target.blur();
  }
}
