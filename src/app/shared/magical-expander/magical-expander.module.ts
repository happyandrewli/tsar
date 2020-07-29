import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MagicalExpanderComponent } from './magical-expander.component';

const publicApi = [
  MagicalExpanderComponent
]

@NgModule({
  imports: [CommonModule],
  exports: [publicApi],
  declarations: [publicApi],
  providers: [],
})
export class MagicalExpanderModule {
}