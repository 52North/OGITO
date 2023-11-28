import { TestBed } from '@angular/core/testing';

import { AppconfigService } from './appconfig.service';

describe('AppconfigService', () => {
  let service: AppconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
