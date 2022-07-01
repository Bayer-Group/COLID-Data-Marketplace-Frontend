import { TestBed } from '@angular/core/testing';

import { SimilarityServiceService } from './similarity-service.service';

describe('SimilarityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimilarityServiceService = TestBed.get(SimilarityServiceService);
    expect(service).toBeTruthy();
  });
});
