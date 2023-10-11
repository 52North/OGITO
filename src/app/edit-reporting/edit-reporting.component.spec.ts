import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReportingComponent } from './edit-reporting.component';

describe('EditReportingComponent', () => {
  let component: EditReportingComponent;
  let fixture: ComponentFixture<EditReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
