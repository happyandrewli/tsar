import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LayoutDefaultComponent } from './default/default.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { FilterPipe } from './default/header/filter.pipe';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { LayoutThemeBtnComponent } from './default/theme-btn/theme-btn.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';

import { AutoCompleteContentDirective } from '../shared/auto-complete/auto-complete-content.directive';
import { StepsAutocompleteTriggerDirective } from '../shared/auto-complete/auto-complete-trigger.directive';
import { AutoCompleteComponent } from '../shared/auto-complete/auto-complete.component';
import { AutoCompleteDirective } from '../shared/auto-complete/auto-complete.directive';
import { OptionComponent } from '../shared/auto-complete/option/option.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  HeaderComponent,
  SidebarComponent,
  LayoutThemeBtnComponent,
  AutoCompleteComponent, OptionComponent, AutoCompleteDirective, AutoCompleteContentDirective, StepsAutocompleteTriggerDirective
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderFullScreenComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  FilterPipe
];

// passport
import { LayoutPassportComponent } from './passport/passport.component';
const PASSPORT = [
  LayoutPassportComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT
  ],
  exports: [
    ...COMPONENTS,
    ...PASSPORT
  ]
})
export class LayoutModule { }
