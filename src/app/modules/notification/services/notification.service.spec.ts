import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { HttpClientModule } from '@angular/common/http';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
