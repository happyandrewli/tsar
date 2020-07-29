import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Chart } from '@antv/g2';
import html2canvas from 'html2canvas';
import { FileSaverService } from 'ngx-filesaver';

import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';

@UntilDestroy()
@Component({
  selector: 'app-series-series-series-graph',
  templateUrl: './series-graph.component.html',
  styleUrls: ['./series-graph.component.less']
})
export class SeriesGraphComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private seriesService: SeriesService, private seriesQuery: SeriesQuery, private fileSaverService: FileSaverService, private ngZone: NgZone) { }
  sChart: Chart;
  chart: Chart;


  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('screen', { static: false }) screen: ElementRef;


  showAdvSearch = true;
  isFullscreen = false;
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    combineLatest([
      this.seriesQuery.selectFilters$,
      this.seriesQuery.selectSearchTerm$,
      this.seriesQuery.selectUploadedNames$,
      this.seriesQuery.selectPageNumber$,
      this.seriesQuery.selectPageSize$
    ]).pipe(switchMap(([filters, term, uploadedNames, pageNumber, pageSize]) => {
      return this.seriesService.getAll(term, uploadedNames, filters, pageNumber, pageSize);
    }), untilDestroyed(this)).subscribe({
      error() {
      }
    });

    this.seriesQuery.selectAll().pipe(untilDestroyed(this)).subscribe(seriesList => {
      const formattedSeriesList = [];
      seriesList.forEach(series => {
        this.seriesQuery.valHeaders.forEach(statP => {
          if (this.seriesQuery.from <= statP && this.seriesQuery.to >= statP) {
            formattedSeriesList.push({ name: series.name, statPeriod: statP.slice(3), value: parseFloat(series[statP]) });
          }
        });
      });
      if (formattedSeriesList.length > 0) {
        if (this.sChart) {
          // this.sChart.changeData(formattedSeriesList);
          // this.sChart.changeData(this.testData);
          // setTimeout(() => this.sChart.changeData(formattedSeriesList), 2000);
          this.ngZone.runOutsideAngular(() => setTimeout(() => this.sChart.changeData(formattedSeriesList), 0));
        } else {
          this.ngZone.runOutsideAngular(() => setTimeout(() => this.sChart.changeData(formattedSeriesList), 2000));
        }
      }
    });

    this.seriesQuery.selectFrom$.pipe(untilDestroyed(this)).subscribe(from => {
      const formattedSeriesList = [];
      this.seriesQuery.getAll().forEach(series => {
        this.seriesQuery.valHeaders.forEach(statP => {
          if (from <= statP && this.seriesQuery.to >= statP) {
            formattedSeriesList.push({ name: series.name, statPeriod: statP.slice(3), value: parseFloat(series[statP]) });
          }
        });
      });
      if (formattedSeriesList.length > 0) {
        if (this.sChart) {
          this.sChart.changeData(formattedSeriesList);
        }
      }
    });

    this.seriesQuery.selectTo$.pipe(untilDestroyed(this)).subscribe(to => {
      const formattedSeriesList = [];
      this.seriesQuery.getAll().forEach(series => {
        this.seriesQuery.valHeaders.forEach(statP => {
          if (this.seriesQuery.from <= statP && to >= statP) {
            formattedSeriesList.push({ name: series.name, statPeriod: statP.slice(3), value: parseFloat(series[statP]) });
          }
        });
      });
      if (formattedSeriesList.length > 0) {
        if (this.sChart) {
          this.sChart.changeData(formattedSeriesList);
        }
      }
    });

    this.sChart = new Chart({
      container: 'sGraph',
      // autoFit: true,
      width: 1080,
      height: 600,
      padding: [80, 40, 50, 40] // top, right, bottom, left
    });
    this.sChart.changeData([{ name: 'A', statPeriod: '2015', value: 0 }]);
    this.sChart.line()
      .position('statPeriod*value')
      .color('name');
    // .shape('smooth');
    this.sChart.point()
      .position('statPeriod*value')
      .color('name')
      .shape('circle');
    // this.sChart.tooltip(false);
    this.sChart.axis('statPeriod', {
      title: {}
    });
    this.sChart.axis('value', {
      title: {}
    });
    this.sChart.scale('statPeriod', {
      alias: 'Stat Period'
    });
    this.sChart.render();
  }
  downloadGraph(type: string) {
    html2canvas(this.screen.nativeElement, { height: 700 }).then(canvas => {
      canvas.toBlob(blob => {
        this.fileSaverService.save(blob, `series-diagram.${type}`);
      });
    });
  }
  toggleAdvSearch() {
    this.showAdvSearch = !this.showAdvSearch;
  }
  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }
}
