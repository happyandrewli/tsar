import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Series } from './series.model';
import { SeriesState, SeriesStore } from './series.store';

@Injectable({ providedIn: 'root' })
export class SeriesQuery extends QueryEntity<SeriesState, Series>{
  selectFilters$ = this.select('filters');
  selectSearchTerm$ = this.select('searchTerm');
  selectUploadedNames$ = this.select('uploadedNames');
  selectCount$ = this.select('count');
  selectPageNumber$ = this.select('pageNumber');
  selectPageSize$ = this.select('pageSize');
  selectFrom$ = this.select('from');
  selectTo$ = this.select('to');
  selectValHeaders$ = this.select('valHeaders');

  get filters() {
    return this.getValue().filters;
  }

  get searchTerm() {
    return this.getValue().searchTerm;
  }

  get uploadedNames() {
    return this.getValue().uploadedNames;
  }

  get count() {
    return this.getValue().count;
  }

  get pageNumber() {
    return this.getValue().pageNumber;
  }

  get pageSize() {
    return this.getValue().pageSize;
  }

  get from() {
    return this.getValue().from;
  }

  get to() {
    return this.getValue().to;
  }

  get valHeaders() {
    return this.getValue().valHeaders;
  }

  constructor(protected store: SeriesStore) {
    super(store);
  }
}
