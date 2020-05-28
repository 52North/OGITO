import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingToolbarComponent } from './editing-toolbar.component';

describe('EditingToolbarComponent', () => {
  let component: EditingToolbarComponent;
  let fixture: ComponentFixture<EditingToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditingToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditingToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
