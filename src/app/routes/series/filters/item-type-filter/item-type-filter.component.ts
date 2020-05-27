import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { untilDestroyed } from '@ngneat/until-destroy';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { switchMap } from 'rxjs/operators';

import { SeriesQuery } from 'src/app/state/series/series.query';
import { SeriesService } from 'src/app/state/series/series.service';
import { SurveysService } from 'src/app/state/survey/surveys.service';

@Component({
  selector: 'app-item-type-filter',
  templateUrl: './item-type-filter.component.html',
  styleUrls: ['./item-type-filter.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemTypeFilterComponent),
      multi: true
    }
  ]
})
export class ItemTypeFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  itemTypes = [];
  itemTypeButtonText = 'Item Types';
  itemTypeButtonStyle: 'selected' | 'default' = 'default';

  visible: boolean;
  triggeredBySaveBtn = false;
  values: string[] = [];

  configureItemTypeButton() {
    const selectedItemTypes = this.itemTypes.filter(itemType => itemType.checked === true).map(itemType => itemType.label);
    if (selectedItemTypes.length === 1) {
      this.itemTypeButtonText = selectedItemTypes[0];
      this.itemTypeButtonStyle = 'selected';
    } else if (selectedItemTypes.length > 1) {
      this.itemTypeButtonText = `Item Types: ${selectedItemTypes.length}`;
      this.itemTypeButtonStyle = 'selected';
    } else {
      this.itemTypeButtonText = 'Item Types';
      this.itemTypeButtonStyle = 'default';
    }
  }

  writeValue(values: string[]): void {
    this.values = values;
    if (values !== undefined && this.itemTypes.length > 0) {
      this.itemTypes.map(itemType => itemType.checked = false);
      values.forEach(val => {
        this.itemTypes.find(itemType => itemType.value === val).checked = true;
      });
      this.configureItemTypeButton();
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

  close(): void {
    if (!this.triggeredBySaveBtn) {
      if (this.visible === false) {
        this.comparePropagate();
      }
    }
    this.triggeredBySaveBtn = false;
  }

  clear(): void {
    this.itemTypes.forEach(itemType => itemType.checked = false);
  }

  private comparePropagate() {
    const checkedItemTypes = this.itemTypes.filter(itemType => itemType.checked === true).map(itemType => itemType.value);

    if (checkedItemTypes.length === 0 && this.seriesQuery.filters.itemTypes.length === 0) {
      return;
    }

    // Need to make a copy of the array before sorting it because it is forzen in strict mode.
    // https://stackoverflow.com/questions/53420055/error-while-sorting-array-of-objects-cannot-assign-to-read-only-property-2-of/53420326
    if (this.seriesQuery.filters.itemTypes.slice().sort().join(',') === checkedItemTypes.sort().join(',')) {
      return;
    }

    this.configureItemTypeButton();
    this.propagateChange(checkedItemTypes);
  }

  constructor(private seriesQuery: SeriesQuery, private seriesService: SeriesService, private surveysService: SurveysService) { }

  private processOptions(options) {
    this.itemTypes = options.map(itemType => {
      if (itemType === 'CV') {
        return { label: 'CV - Coffecient of Variation', value: itemType, checked: false };
      } else if (itemType === 'EST') {
        return { label: 'EST - Estimate', value: itemType, checked: false };
      } else if (itemType === 'IMP') {
        return { label: 'IMP - Imputation', value: itemType, checked: false };
      } else if (itemType === 'REV') {
        return { label: 'REV - Revenue', value: itemType, checked: false };
      } else if (itemType === 'SE') {
        return { label: 'SE - Standard Error', value: itemType, checked: false };
      } else if (itemType === 'YY') {
        return { label: 'YY - Year to Year Difference', value: itemType, checked: false };
      } else {
        return { label: '', value: itemType, checked: false };
      }
    });

    if (this.values !== undefined && this.itemTypes.length > 0) {
      this.itemTypes.map(itemType => itemType.checked = false);
      this.values.forEach(val => {
        this.itemTypes.find(itemType => itemType.value === val).checked = true;
      });
      this.configureItemTypeButton();
    }
  }

  ngOnInit() {
    this.seriesService.getSeriesItemTypes().subscribe(itemTypes => {
      this.processOptions(itemTypes);
    });

    this.surveysService.surveyChanged.pipe(
      switchMap(() => {
        return this.seriesService.getSeriesItemTypes();
      }), untilDestroyed(this)).subscribe((itemTypes) => {
        this.processOptions(itemTypes);
      });
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }
}
