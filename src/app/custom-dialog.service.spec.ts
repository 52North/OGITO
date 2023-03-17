import { TestBed } from '@angular/core/testing';

import { CustomDialogService } from './custom-dialog.service';

describe('CustomDialogService', () => {
  let service: CustomDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
