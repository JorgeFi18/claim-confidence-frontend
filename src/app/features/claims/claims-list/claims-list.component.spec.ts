import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsListComponent } from './claims-list.component';
import { ClaimsService } from '../../../core/services/claims.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { Claim } from '../../../core/models/claim.model';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../../core/models/user.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClaimsListComponent', () => {
  let component: ClaimsListComponent;
  let fixture: ComponentFixture<ClaimsListComponent>;
  let claimsServiceSpy: jasmine.SpyObj<ClaimsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'claimant',
    status: 'active',
    lastLogin: new Date('2024-01-01')
  };

  const mockClaims: Claim[] = [
    {
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
    }
  ];

  beforeEach(async () => {
    const claimsSpy = jasmine.createSpyObj('ClaimsService', ['getClaims']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    // Setup the spies
    claimsSpy.getClaims.and.returnValue(of(mockClaims));
    authSpy.getCurrentUser.and.returnValue({ ...mockUser, role: 'claimant' });

    await TestBed.configureTestingModule({
      imports: [
        ClaimsListComponent, 
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ClaimsService, useValue: claimsSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    claimsServiceSpy = TestBed.inject(ClaimsService) as jasmine.SpyObj<ClaimsService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load claims on init', () => {
    fixture.detectChanges();
    expect(component.claims).toEqual(mockClaims);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading claims', () => {
    const errorMessage = 'Error loading claims';
    claimsServiceSpy.getClaims.and.returnValue(throwError(() => new Error(errorMessage)));
    fixture.detectChanges();

    expect(component.error).toBe(errorMessage);
    expect(component.isLoading).toBeFalse();
  });

  it('should set isClaimant to true when user is a claimant', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ ...mockUser, role: 'claimant' });
    fixture.detectChanges();

    expect(component.isClaimant).toBeTrue();
  });

  it('should set isClaimant to false when user is not a claimant', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ ...mockUser, role: 'manager' });
    fixture.detectChanges();

    expect(component.isClaimant).toBeFalse();
  });

  describe('getStatusClass', () => {
    it('should return correct class for approved status', () => {
      fixture.detectChanges();
      expect(component.getStatusClass('approved')).toBe('bg-green-100 text-green-800');
    });

    it('should return correct class for rejected status', () => {
      fixture.detectChanges();
      expect(component.getStatusClass('rejected')).toBe('bg-red-100 text-red-800');
    });

    it('should return correct class for pending status', () => {
      fixture.detectChanges();
      expect(component.getStatusClass('pending')).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return default class for unknown status', () => {
      fixture.detectChanges();
      expect(component.getStatusClass('unknown')).toBe('bg-yellow-100 text-yellow-800');
    });
  });

  describe('getPriorityClass', () => {
    it('should return correct class for high priority', () => {
      fixture.detectChanges();
      expect(component.getPriorityClass('high')).toBe('bg-red-100 text-red-800');
    });

    it('should return correct class for medium priority', () => {
      fixture.detectChanges();
      expect(component.getPriorityClass('medium')).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return correct class for low priority', () => {
      fixture.detectChanges();
      expect(component.getPriorityClass('low')).toBe('bg-green-100 text-green-800');
    });

    it('should return default class for unknown priority', () => {
      fixture.detectChanges();
      expect(component.getPriorityClass('unknown')).toBe('bg-green-100 text-green-800');
    });
  });
});
