import { TestBed } from '@angular/core/testing';

import { OpenLayersService } from './open-layers.service';

describe('OpenLayersService', () => {
  let service: OpenLayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
