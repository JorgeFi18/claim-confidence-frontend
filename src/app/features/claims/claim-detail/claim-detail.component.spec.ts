import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimDetailComponent, ClaimStatus } from './claim-detail.component';
import { ClaimsService } from '../../../core/services/claims.service';
import { LogService } from '../../../core/services/log.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Claim } from '../../../core/models/claim.model';
import { Log } from '../../../core/services/log.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the User interface locally to resolve the linter error
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: Date;
  providerId?: string;
}

describe('ClaimDetailComponent', () => {
  let component: ClaimDetailComponent;
  let fixture: ComponentFixture<ClaimDetailComponent>;
  let claimsServiceSpy: jasmine.SpyObj<ClaimsService>;
  let logServiceSpy: jasmine.SpyObj<LogService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: new Date('2024-01-01')
  };

  const mockClaim: Claim = {
    _id: '1',
    benefit: 'Short Term Disability',
    fullName: 'John Doe',
    birthDate: '1990-01-01',
    gender: 'Male',
    phoneNumber: '1234567890',
    workPhoneNumber: '0987654321',
    dependants: false,
    roleStartDate: '2023-01-01',
    providerId: 'provider1',
    userId: 'user1',
    status: 'pending',
    createdAt: '2024-01-01',
    comments: [],
    isDeleted: false
  };

  const mockLogs: Log[] = [
    {
      _id: '1',
      claimId: '1',
      action: 'Claim created',
      date: '2024-01-01',
      userId: 'user1'
    }
  ];

  beforeEach(async () => {
    const claimsSpy = jasmine.createSpyObj('ClaimsService', ['getClaimById', 'updateClaimStatus', 'addComment']);
    const logSpy = jasmine.createSpyObj('LogService', ['getClaimLogs']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Setup the spies
    claimsSpy.getClaimById.and.returnValue(of(mockClaim));
    logSpy.getClaimLogs.and.returnValue(of(mockLogs));
    authSpy.getCurrentUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ClaimsService, useValue: claimsSpy },
        { provide: LogService, useValue: logSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA] // This will ignore unknown elements and attributes
    })
    .overrideComponent(ClaimDetailComponent, {
      set: {
        template: '<div></div>' // Empty template to avoid RouterLink issues
      }
    })
    .compileComponents();

    claimsServiceSpy = TestBed.inject(ClaimsService) as jasmine.SpyObj<ClaimsService>;
    logServiceSpy = TestBed.inject(LogService) as jasmine.SpyObj<LogService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Now safe to call with the empty template
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load claim and logs on init', () => {
    expect(component.claim).toEqual(mockClaim);
    expect(component.logs).toEqual(mockLogs);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading claim', () => {
    claimsServiceSpy.getClaimById.and.returnValue(throwError(() => new Error('Error loading claim')));
    component.ngOnInit();
    expect(component.error).toBe('Error loading claim details');
    expect(component.isLoading).toBeFalse();
  });

  it('should update claim status when user is manager', () => {
    component.claim = mockClaim;
    component.isManager = true;
    claimsServiceSpy.updateClaimStatus.and.returnValue(of({ ...mockClaim, status: 'approved' }));
    component.updateClaimStatus(ClaimStatus.APPROVED);
    expect(claimsServiceSpy.updateClaimStatus).toHaveBeenCalledWith('1', 'approved');
  });

  it('should not update claim status when user is not manager', () => {
    component.claim = mockClaim;
    component.isManager = false;
    component.updateClaimStatus(ClaimStatus.APPROVED);
    expect(claimsServiceSpy.updateClaimStatus).not.toHaveBeenCalled();
  });

  it('should add comment when form is valid', () => {
    component.claim = mockClaim;
    component.commentForm.setValue({ message: 'Test comment' });
    claimsServiceSpy.addComment.and.returnValue(of(mockClaim));
    component.onSubmitComment();
    // The actual implementation passes the message string only, not an object
    expect(claimsServiceSpy.addComment).toHaveBeenCalledWith('1', 'Test comment');
  });

  it('should not add comment when form is invalid', () => {
    component.claim = mockClaim;
    component.commentForm.setValue({ message: '' });
    component.onSubmitComment();
    expect(claimsServiceSpy.addComment).not.toHaveBeenCalled();
  });

  describe('getStatusClass', () => {
    it('should return correct class for each status', () => {
      expect(component.getStatusClass('pending')).toBe('bg-yellow-100 text-yellow-800');
      expect(component.getStatusClass('submitted')).toBe('bg-blue-100 text-blue-800');
      expect(component.getStatusClass('review')).toBe('bg-purple-100 text-purple-800');
      expect(component.getStatusClass('approved')).toBe('bg-green-100 text-green-800');
      expect(component.getStatusClass('rejected')).toBe('bg-red-100 text-red-800');
      expect(component.getStatusClass('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });
});
