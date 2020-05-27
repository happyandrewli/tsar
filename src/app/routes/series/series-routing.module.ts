import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeriesGraphComponent } from './series-graph/series-graph.component';
import { SeriesTableComponent } from './series-table/series-table.component';
import { SeriesComponent } from './series.component';

const routes: Routes = [
  {
    path: '', component: SeriesComponent, children: [
      { path: 'tview', component: SeriesTableComponent },
      { path: 'gview', component: SeriesGraphComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
