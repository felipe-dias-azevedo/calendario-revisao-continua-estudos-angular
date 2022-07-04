import { TestBed } from '@angular/core/testing';

import { StateModalShownService } from './state-modal-shown.service';

describe('StateModalShownService', () => {
  let service: StateModalShownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateModalShownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
