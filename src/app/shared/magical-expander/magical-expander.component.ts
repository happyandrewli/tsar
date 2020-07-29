import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';

const wrapCls = `full-content__body`;
const openedCls = `full-content__opened`;
const hideTitleCls = `full-content__hidden-title`;

@Component({
  selector: 'app-magical-expander',
  exportAs: 'magicalExpander',
  template: ` <ng-content></ng-content> `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MagicalExpanderComponent implements OnInit {
  private bodyEl: HTMLElement;
  private clss;

  constructor(@Inject(DOCUMENT) private doc: any) { }
  private _fullscreen: boolean;
  @Input() set fullscreen(value: boolean) {
    if (this.clss) {
      this._fullscreen = value;
      if (this._fullscreen) {
        this.clss.add(openedCls);
        this.clss.add(hideTitleCls);
      } else {
        this.clss.remove(openedCls);
        this.clss.remove(hideTitleCls);
      }
    }
  }

  ngOnInit(): void {
    this.bodyEl = this.doc.querySelector('body');
    this.clss = this.bodyEl.classList;
    this.clss.remove(openedCls);
    this.clss.remove(hideTitleCls);
  }
}
