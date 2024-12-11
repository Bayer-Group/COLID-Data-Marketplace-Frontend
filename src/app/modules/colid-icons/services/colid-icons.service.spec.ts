import { TestBed } from '@angular/core/testing';

import { ColidIconsService } from './colid-icons.service';

describe('ColidIconsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColidIconsService = TestBed.get(ColidIconsService);
    expect(service).toBeTruthy();
  });
});
