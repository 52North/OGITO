import { TestBed } from '@angular/core/testing';

import { LabelLutService } from './label-lut.service';

describe('LabelLutService', () => {
  let service: LabelLutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelLutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
