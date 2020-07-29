import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';

// single pages
import { CallbackComponent } from './callback/callback.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
// dashboard pages
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { RouteRoutingModule } from './routes-routing.module';


const COMPONENTS = [
  DashboardMonitorComponent,
  DashboardAnalysisComponent,
  // passport pages
  UserLoginComponent,
  // single pages
  CallbackComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class RoutesModule { }
