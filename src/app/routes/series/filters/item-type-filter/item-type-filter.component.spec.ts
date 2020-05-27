import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeFilterComponent } from './item-type-filter.component';

describe('ItemTypeFilterComponent', () => {
  let component: ItemTypeFilterComponent;
  let fixture: ComponentFixture<ItemTypeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
