import { Component, OnDestroy, OnInit } from '@angular/core';


import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';

import { FileSaverService } from 'ngx-filesaver';

import { Series } from 'src/app/state/series/series.model';
import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { Survey } from 'src/app/state/survey/survey.model';
import { SurveysQuery } from 'src/app/state/survey/surveys.query';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@UntilDestroy()
@Component({
  selector: 'app-series-table',
  templateUrl: './series-table.component.html',
  styleUrls: ['./series-table.component.less']
})
export class SeriesTableComponent implements OnInit, OnDestroy {

  constructor(private seriesService: SeriesService, private seriesQuery: SeriesQuery, private message: NzMessageService, private fileSaverService: FileSaverService, private fb: FormBuilder, private nzContextMenuService: NzContextMenuService, private surveysQuery: SurveysQuery, private surveysService: SurveysService) { }

  isLoading$: Observable<boolean>;
  seriesList$: Observable<Series[]>;
  count$: Observable<number>;
  pageNumber$: Observable<number>;
  pageSize$: Observable<number>;
  localSearchTerm$: Observable<string>;
  valHeaders$: Observable<string[]>;

  from$: Observable<string>;
  to$: Observable<string>;

  activeSurvey$: Observable<Survey>;

  isExpanded = 'C';

  // Below is the code for CRUD operations of a series.
  isVisible = false;

  crudMode: 'ADD' | 'EDIT' = 'EDIT';
  editSeriesValues: { x: string | number, y: string | number }[] = [];

  seriesForm: FormGroup;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  // Context Menu End

  showAdvSearch = true;

  // Bulk Editing
  mapOfCheckedId: { [key: string]: boolean } = {};

  // Edit Table Field
  editTblVisible = false;
  validateEditTblForm: FormGroup = this.fb.group({
    tbl: [null, [Validators.required]]
  });

  // Edit Topic Field
  editTopicVisible = false;
  validateEditTopicForm: FormGroup = this.fb.group({
    topic: [null, [Validators.required]]
  });

  isFullscreen = false;

  scroll = { y: '230px' };
  ngOnInit() {
    this.initGroup();

    this.isLoading$ = this.seriesQuery.selectLoading();
    this.seriesList$ = this.seriesQuery.selectAll();
    this.count$ = this.seriesQuery.selectCount$;
    this.pageNumber$ = this.seriesQuery.selectPageNumber$;
    this.pageSize$ = this.seriesQuery.selectPageSize$;
    this.localSearchTerm$ = this.seriesQuery.selectSearchTerm$;

    this.valHeaders$ = this.seriesQuery.selectValHeaders$;

    this.from$ = this.seriesQuery.selectFrom$;
    this.to$ = this.seriesQuery.selectTo$;

    this.activeSurvey$ = this.surveysQuery.selectActive();

    this.surveysService.surveyChanged.pipe(untilDestroyed(this)).subscribe(() => {
      this.initGroup();
    });

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
  }
  ngOnDestroy() { }

  download(type: string) {
    const fileName = `series-table.${type}`;
    const fileType = this.fileSaverService.genType(fileName);
    if (type === 'xlsx') {

    } else if (type === 'csv') {
      this.seriesService.download(this.seriesQuery.searchTerm, this.seriesQuery.uploadedNames, this.seriesQuery.filters, 'csv').subscribe(data => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        this.fileSaverService.save(blob, fileName);
      });
    }
  }

  handleCancel(e: MouseEvent): void {
    e.preventDefault();
    this.isVisible = false;
    this.seriesForm.reset();

  }
  upsert(series?: Series) {
    this.isVisible = true;
    if (!series) {
      this.crudMode = 'ADD';
      const blankSeries = {
        id: '',
        name: '',
        flag: '',
        naics: '',
        item: '',
        topic: '',
        subtopic: '',
        item_type: '',
        data_type: '',
        form: '',
        tbl: '',
        view: '',
        last_updated: ''
      };
      this.seriesQuery.valHeaders.forEach(header => {
        blankSeries[header] = '';
      });
      this.seriesForm.patchValue(blankSeries);
    } else {
      this.crudMode = 'EDIT';
      this.seriesForm.patchValue(series);
      this.editSeriesValues = [];
      this.seriesQuery.valHeaders.forEach(header => {
        this.editSeriesValues.push(
          { x: header, y: series[header] }
        );
      });
    }
  }

  isNewlyUpdatedSeries(lastUpdated: string) {
    if (Date.now() - Date.parse(lastUpdated) > 0 && (Date.now() - Date.parse(lastUpdated)) / (1000 * 3600 * 24) < 1) {
      return true;
    }
    return false;
  }

  deleteSeries(series: Series) {
    this.seriesService.deleteSeries(series).subscribe(data => {
      this.seriesService.getAll(this.seriesQuery.searchTerm, this.seriesQuery.uploadedNames, this.seriesQuery.filters, this.seriesQuery.pageNumber, this.seriesQuery.pageSize).subscribe({
        error() {
        }
      });
      this.message.create('success', `${series.name} is successfully deleted.`);
    });
  }

  submitSeriesForm(series: Series): void {
    if (series.id) {
      const d = new Date();
      series.last_updated = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
      this.seriesService.upsert([series]).subscribe(data => {
        this.message.create('success', `${series.name} is successfully updated.`);
      });
    } else {
      const d = new Date();
      series.last_updated = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
      this.seriesService.add(series).subscribe(data => {
        this.message.create('success', `${series.name} is successfully created.`);
        this.seriesService.getAll(this.seriesQuery.searchTerm, this.seriesQuery.uploadedNames, this.seriesQuery.filters, this.seriesQuery.pageNumber, this.seriesQuery.pageSize).subscribe({
          error() {
          }
        });
      });
    }
    this.seriesForm.reset();
    this.isVisible = false;
  }
  private initGroup() {
    this.seriesForm = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])],
      flag: ['', Validators.compose([Validators.required])],
      naics: [''],
      item: [''],
      topic: [''],
      subtopic: [''],
      item_type: [''],
      data_type: ['', Validators.maxLength(1)],
      form: [''],
      tbl: [''],
      view: [''],
      last_updated: [''],
    });

    this.seriesQuery.valHeaders.forEach(header => {
      this.seriesForm.addControl(header, new FormControl('', Validators.required));
    });
  }

  // Context Menu Begin
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
  toggleAdvSearch() {
    this.showAdvSearch = !this.showAdvSearch;
  }

  refreshStatus(): void {
  }
  openEditTblDrawer() {
    const checkedIds = [];
    for (const [id, checked] of Object.entries(this.mapOfCheckedId)) {
      if (checked) {
        checkedIds.push(id);
      }
    }
    if (checkedIds.length > 0) {
      this.editTblVisible = true;
    } else {
      this.message.create('error', 'You must select at least one series from the data table.');
    }
  }
  closeEditTblDrawer() {
    this.editTblVisible = false;
  }
  submitEditTblForm() {
    this.editTblVisible = false;

    const checkedIds = [];
    for (const [id, checked] of Object.entries(this.mapOfCheckedId)) {
      if (checked) {
        checkedIds.push(id);
      }
    }
    this.seriesService.updateTblField(checkedIds, this.validateEditTblForm.controls.tbl.value).subscribe(data => {
      this.message.create('success', 'Series Table field updated successfully.');
    });
    this.validateEditTblForm.reset();
  }
  openEditTopicDrawer() {
    this.editTopicVisible = true;
  }
  closeEditTopicDrawer() {
    this.editTopicVisible = false;
  }
  submitEditTopicForm() {
    this.editTopicVisible = false;
    const checkedIds = [];
    for (const [id, checked] of Object.entries(this.mapOfCheckedId)) {
      if (checked) {
        checkedIds.push(id);
      }
    }
    this.seriesService.updateTopicField(checkedIds, this.validateEditTopicForm.controls.topic.value).subscribe(data => {
      this.message.create('success', 'Series Topic field updated successfully.');
    });
    this.validateEditTopicForm.reset();

  }


  // Page Number and Page Size
  updatePageNumber(pageNumber: number) {
    this.seriesService.updatePageNumber(pageNumber);
  }
  updatePageSize(pageSize: number) {
    this.seriesService.updatePageSize(pageSize);
  }
  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }
  fullChange(val: boolean) {
    this.scroll = val ? { y: '350px' } : { y: '230px' };
  }
}
