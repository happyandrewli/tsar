import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appAutoCompleteContent]'
})
export class AutoCompleteContentDirective {
  constructor(public tpl: TemplateRef<any>) {
  }
}
