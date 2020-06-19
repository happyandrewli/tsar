import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs.component';
import { OperationLogsComponent } from './operation-logs/operation-logs.component';

export const routes: Routes = [
  {
    path: '', component: LogsComponent, children: [
      { path: 'operations', component: OperationLogsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
