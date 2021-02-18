import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayerPanelComponent } from './layer-panel.component';

describe('LayerPanelComponent', () => {
  let component: LayerPanelComponent;
  let fixture: ComponentFixture<LayerPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
