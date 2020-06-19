import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './logs.component';
import { OperationLogsComponent } from './operation-logs/operation-logs.component';

@NgModule({
  imports: [SharedModule, LogsRoutingModule],
  exports: [],
  declarations: [LogsComponent, OperationLogsComponent],
  providers: [],
})
export class LogsModule { }
