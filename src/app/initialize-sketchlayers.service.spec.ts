import { TestBed } from '@angular/core/testing';

import { InitializeSketchlayersService } from './initialize-sketchlayers.service';

describe('InitializeSketchlayersService', () => {
  let service: InitializeSketchlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitializeSketchlayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
