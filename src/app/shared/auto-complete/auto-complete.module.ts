import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoCompleteComponent } from './auto-complete.component';
import { AutoCompleteDirective } from './auto-complete.directive';
import { AutoCompleteContentDirective } from './auto-complete-content.directive';
import { OptionComponent } from './option/option.component';


const publicApi = [
  AutoCompleteComponent,
  AutoCompleteDirective,
  AutoCompleteContentDirective,
  OptionComponent
]

@NgModule({
  imports: [CommonModule],
  exports: [publicApi],
  declarations: [publicApi],
  providers: [],
})
export class AutoCompleteModule {
}
