import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResultExposedComponent } from './dialog-result-exposed.component';

describe('DialogResultExposedComponent', () => {
  let component: DialogResultExposedComponent;
  let fixture: ComponentFixture<DialogResultExposedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResultExposedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResultExposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
