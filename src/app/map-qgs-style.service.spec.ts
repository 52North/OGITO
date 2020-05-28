import { TestBed } from '@angular/core/testing';

import { MapQgsStyleService } from './map-qgs-style.service';

describe('MapQgsStyleService', () => {
  let service: MapQgsStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapQgsStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
