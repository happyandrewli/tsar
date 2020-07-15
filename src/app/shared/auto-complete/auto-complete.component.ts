import { Component, ContentChild, ContentChildren, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AutoCompleteContentDirective } from './auto-complete-content.directive';
import { OptionComponent } from './option/option.component';

@Component({
  selector: 'app-autocomplete',
  templateUrl: 'auto-complete.component.html',
  styleUrls: ['./auto-complete.component.less'],
  exportAs: 'tsar-auto-complete'
})

export class AutoCompleteComponent {
  @ViewChild('root') rootTemplate: TemplateRef<any>;
  @ContentChild(AutoCompleteContentDirective)
  content: AutoCompleteContentDirective;
  @ContentChildren(OptionComponent) options: QueryList<OptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map(option => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
