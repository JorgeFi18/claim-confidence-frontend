import { TestBed } from '@angular/core/testing';
import { ClaimsService } from './claims.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClaimsService]
    });
    service = TestBed.inject(ClaimsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
