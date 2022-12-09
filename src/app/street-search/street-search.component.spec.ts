import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetSearchComponent } from './street-search.component';

describe('StreetSearchComponent', () => {
  let component: StreetSearchComponent;
  let fixture: ComponentFixture<StreetSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreetSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
