import { TestBed } from '@angular/core/testing';

import { ContextStorageService } from './context-storage.service';

describe('ContextStorageService', () => {
  let service: ContextStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
