import { TestBed } from '@angular/core/testing';

import { NbInputService } from './nb-input.service';

describe('NbInputService', () => {
  let service: NbInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NbInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
