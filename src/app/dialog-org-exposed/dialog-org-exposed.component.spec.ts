import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrgExposedComponent } from './dialog-org-exposed.component';

describe('DialogOrgExposedComponent', () => {
  let component: DialogOrgExposedComponent;
  let fixture: ComponentFixture<DialogOrgExposedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOrgExposedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrgExposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
