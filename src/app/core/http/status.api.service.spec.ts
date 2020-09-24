import { TestBed } from '@angular/core/testing';

import { StatusApiService } from './status.api.service';

describe('Status.ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusApiService = TestBed.get(StatusApiService);
    expect(service).toBeTruthy();
  });
});
