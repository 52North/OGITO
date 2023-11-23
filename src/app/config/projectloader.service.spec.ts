import { TestBed } from '@angular/core/testing';

import { ProjectloaderService } from './projectloader.service';

describe('ProjectloaderService', () => {
  let service: ProjectloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
