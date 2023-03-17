import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeldingenComponent } from './edit-meldingen.component';

describe('EditMeldingenComponent', () => {
  let component: EditMeldingenComponent;
  let fixture: ComponentFixture<EditMeldingenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMeldingenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeldingenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
