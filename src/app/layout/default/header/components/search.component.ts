import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';
// import { NzAutocompleteTriggerDirective } from 'ng-zorro-antd/auto-complete/ng-zorro-antd-auto-complete';


@UntilDestroy()
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
              private surveysService: SurveysService,
              private routerQuery: RouterQuery) { }
  qIpt: HTMLInputElement;

  @HostBinding('class.alain-default__search-focus')
  focus = false;

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  searchControl = new FormControl();
  routerData$: Observable<any>;
  filteredSeriesNames: { value: string, label: string }[] = [];
  filteredSeriesNamesCount = 0;
  filteredSeriesTopics: { value: string, label: string }[] = [];
  filteredSeriesTopicsCount = 0;
  filteredSeriesNaics: { value: string, label: string }[] = [];
  filteredSeriesNaicsCount = 0;
  filteredSeriesTables: { value: string, label: string }[] = [];
  filteredSeriesTablesCount = 0;

  filteredLogsUsernames: { value: string, label: string }[] = [];
  filteredLogsUsernamesCount = 0;

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

    this.routerData$ = this.routerQuery.select();

    this.seriesService.resetSearchTerm.pipe(untilDestroyed(this)).subscribe(() => {
      this.seriesService.updateSearchTerm('');
      this.searchControl.patchValue(this.seriesQuery.searchTerm);
    });
  }
  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input') as HTMLInputElement;
  }

  ngOnDestroy() { }
  runAutoComplete(val: string) {
    if (this.routerQuery.getValue().state.url === '/series/tview' || this.routerQuery.getValue().state.url === '/series/gview') {
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
    } else if (this.routerQuery.getValue().state.url === '/logs/operations') {
      // 'Andrew Li', 'Megha Signal', 'Jeffrey Shikany', 'Leon Mil', 'Charlie Nguyen'
      this.filteredLogsUsernames = ['mil00001', 'li000340', 'shika001', 'singa002', 'nguye324'].map(username => {
        return {
          value: username, label: username.replace(new RegExp(val, 'gi'), match => {
            return '<a target="_blank">' + match + '</a>';
          })
        };
      });
    }

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

  // @ViewChild('globalSearch', { read: NzAutocompleteTriggerDirective })
  // autoComplete: NzAutocompleteTriggerDirective;
}
