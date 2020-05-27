import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { FavoritesModule } from '../favorites/favorites.module';

import { FiltersComponent } from './filters/filters.component';
import { ItemTypeFilterComponent } from './filters/item-type-filter/item-type-filter.component';
import { TableFilterComponent } from './filters/table-filter/table-filter.component';
import { SeriesGraphComponent } from './series-graph/series-graph.component';
import { SeriesRoutingModule } from './series-routing.module';
import { SeriesTableComponent } from './series-table/series-table.component';
import { SeriesUploadComponent } from './series-upload/series-upload.component';

import { HighlightSearch } from './series-table/highlight-keyword.pipe';
import { SeriesComponent } from './series.component';

const DIALOG_COMPONENTS = [];
const COMPONENTS = [
  SeriesComponent,
  SeriesTableComponent,
  SeriesGraphComponent,
  FiltersComponent,
  ItemTypeFilterComponent,
  TableFilterComponent,
  SeriesUploadComponent,
  HighlightSearch];

@NgModule({
  imports: [
    SharedModule,
    SeriesRoutingModule,
    FavoritesModule
  ],
  declarations: [
    ...COMPONENTS,
    ...DIALOG_COMPONENTS
  ],
  entryComponents: DIALOG_COMPONENTS
})
export class SeriesModule { }
