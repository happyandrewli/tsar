import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { switchMap } from 'rxjs/operators';

import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@UntilDestroy()
@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableFilterComponent),
      multi: true
    }
  ]
})
export class TableFilterComponent implements OnInit, ControlValueAccessor, OnDestroy {
  tables = [];
  tableButtonText = 'Tables';
  tableButtonStyle: 'selected' | 'default' = 'default';
  values: string[] = [];
  visible: boolean;
  triggeredBySaveBtn = false;
  configureTableButton() {
    const selectedTables = this.tables.filter(table => table.checked === true).map(table => table.label);
    if (selectedTables.length === 1) {
      this.tableButtonText = selectedTables[0];
      this.tableButtonStyle = 'selected';
    } else if (selectedTables.length > 1) {
      this.tableButtonText = `Tables: ${selectedTables.length}`;
      this.tableButtonStyle = 'selected';
    } else {
      this.tableButtonText = 'Tables';
      this.tableButtonStyle = 'default';
    }
  }


  writeValue(values: string[]): void {
    this.values = values;
    if (values !== undefined && this.tables.length > 0) {
      this.tables.map(table => table.checked = false);
      values.forEach(val => {
        this.tables.find(table => table.value === val).checked = true;
      });
      this.configureTableButton();
    }
  }
  propagateChange = (_: any) => { };
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }


  save(): void {
    this.visible = false;
    this.comparePropagate();
    this.triggeredBySaveBtn = true;
  }
  clear(): void {
    this.tables.forEach(table => table.checked = false);
  }
  close(): void {
    if (!this.triggeredBySaveBtn) {
      if (this.visible === false) {
        this.comparePropagate();
      }
    }
    this.triggeredBySaveBtn = false;
  }

  private comparePropagate() {
    const checkedTables = this.tables.filter(table => table.checked === true).map(table => table.value);

    if (checkedTables.length === 0 && this.seriesQuery.filters.tables.length === 0) {
      return;
    }
    // Need to make a copy of the array before sorting it because it is forzen in strict mode.
    // https://stackoverflow.com/questions/53420055/error-while-sorting-array-of-objects-cannot-assign-to-read-only-property-2-of/53420326
    if (this.seriesQuery.filters.tables.slice().sort().join(',') === checkedTables.sort().join(',')) {
      return;
    }

    this.configureTableButton();
    this.propagateChange(checkedTables);
  }

  constructor(private seriesQuery: SeriesQuery, private seriesService: SeriesService, private surveysService: SurveysService) { }

  private processOptions(options) {
    this.tables = options.resource.map(table => {
      return { label: table.tbl, value: table.tbl, checked: false };
    });

    if (this.values !== undefined && this.tables.length > 0) {
      this.tables.map(table => table.checked = false);
      this.values.forEach(val => {
        this.tables.find(table => table.value === val).checked = true;
      });
      this.configureTableButton();
    }
  }
  ngOnInit() {
    this.seriesService.getSeriesTables('', {}).subscribe(tables => {
      this.processOptions(tables);
    });

    this.surveysService.surveyChanged.pipe(
      switchMap(() => {
        return this.seriesService.getSeriesTables('', {});
      }), untilDestroyed(this)).subscribe((tables) => {
        this.processOptions(tables);
      });
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }
}
