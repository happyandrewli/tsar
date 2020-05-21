import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Series } from './series.model';

export interface SeriesState extends EntityState<Series> {
  searchTerm: string;
  uploadedNames: string;
  filters: {
    tables: string[];
    view: string;
    itemTypes: string[];
  };

  pageNumber: number;
  pageSize: number;
  count: number;
  from: string;
  to: string;

  valHeaders: string[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'series', resettable: true })
export class SeriesStore extends EntityStore<SeriesState, Series> {
  constructor() {
    super({
      searchTerm: '',
      uploadedNames: '',
      filters: {
        tables: [],
        view: 'BOTH',
        itemTypes: [],
      },
      pageNumber: 1,
      pageSize: 10,
      count: 0,
      from: '',
      to: '',
      valHeaders: []
    });
  }
}
