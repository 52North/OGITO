import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPopulationExposedComponent } from './dialog-population-exposed.component';

describe('DialogPopulationExposedComponent', () => {
  let component: DialogPopulationExposedComponent;
  let fixture: ComponentFixture<DialogPopulationExposedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPopulationExposedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPopulationExposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
