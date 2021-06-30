import { TestBed } from '@angular/core/testing';

import { QueryDBService } from './query-db.service';

describe('QueryDBService', () => {
  let service: QueryDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
