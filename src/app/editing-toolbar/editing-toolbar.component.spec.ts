import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditingToolbarComponent } from './editing-toolbar.component';

describe('EditingToolbarComponent', () => {
  let component: EditingToolbarComponent;
  let fixture: ComponentFixture<EditingToolbarComponent>;

  beforeEach(waitForAsync(() => {
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
