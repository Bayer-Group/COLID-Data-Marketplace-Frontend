import { TestBed } from '@angular/core/testing';

import { ResourceApiService } from 'src/app/core/http/resource.api.service';

describe('ResourceApiService', () => {
  let service: ResourceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
