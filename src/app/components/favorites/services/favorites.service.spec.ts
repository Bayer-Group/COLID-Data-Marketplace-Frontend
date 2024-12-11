import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { HttpClientModule } from '@angular/common/http';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
