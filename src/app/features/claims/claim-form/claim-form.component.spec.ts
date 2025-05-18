import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimFormComponent } from './claim-form.component';
import { ClaimsService } from '../../../core/services/claims.service';
import { ProviderService } from '../../../core/services/provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Claim } from '../../../core/models/claim.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClaimFormComponent', () => {
  let component: ClaimFormComponent;
  let fixture: ComponentFixture<ClaimFormComponent>;
  let claimsServiceSpy: jasmine.SpyObj<ClaimsService>;
  let providerServiceSpy: jasmine.SpyObj<ProviderService>;
  let routerSpy: jasmine.SpyObj<Router>;

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

  const mockProviders = [
    { _id: 'provider1', name: 'Provider 1', status: 'active' },
    { _id: 'provider2', name: 'Provider 2', status: 'active' }
  ];

  beforeEach(async () => {
    const claimsSpy = jasmine.createSpyObj('ClaimsService', ['createClaim']);
    const providerSpy = jasmine.createSpyObj('ProviderService', ['getProviders']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Setup provider spy to return mock providers
    providerSpy.getProviders.and.returnValue(of(mockProviders));

    await TestBed.configureTestingModule({
      imports: [
        ClaimFormComponent, 
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ClaimsService, useValue: claimsSpy },
        { provide: ProviderService, useValue: providerSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        FormBuilder
      ]
    }).compileComponents();

    claimsServiceSpy = TestBed.inject(ClaimsService) as jasmine.SpyObj<ClaimsService>;
    providerServiceSpy = TestBed.inject(ProviderService) as jasmine.SpyObj<ProviderService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.claimForm.get('benefit')?.value).toBe('');
    expect(component.claimForm.get('fullName')?.value).toBe('');
    expect(component.claimForm.get('birthDate')?.value).toBe('');
    expect(component.claimForm.get('gender')?.value).toBe('');
    expect(component.claimForm.get('phoneNumber')?.value).toBe('');
    expect(component.claimForm.get('workPhoneNumber')?.value).toBe('');
    expect(component.claimForm.get('dependants')?.value).toBe(false);
    expect(component.claimForm.get('roleStartDate')?.value).toBe('');
    expect(component.claimForm.get('providerId')?.value).toBe('');
  });

  it('should have benefit options', () => {
    expect(component.benefitOptions).toContain('Short Term Disability');
    expect(component.benefitOptions).toContain('Long Term Disability');
    expect(component.benefitOptions).toContain('Waiver of Premiums');
    expect(component.benefitOptions).toContain('Salary Continuance');
  });

  it('should validate required fields', () => {
    const form = component.claimForm;
    expect(form.valid).toBeFalsy();

    expect(form.get('benefit')?.errors?.['required']).toBeTruthy();
    expect(form.get('fullName')?.errors?.['required']).toBeTruthy();
    expect(form.get('birthDate')?.errors?.['required']).toBeTruthy();
    expect(form.get('gender')?.errors?.['required']).toBeTruthy();
    expect(form.get('phoneNumber')?.errors?.['required']).toBeTruthy();
    expect(form.get('roleStartDate')?.errors?.['required']).toBeTruthy();
    expect(form.get('providerId')?.errors?.['required']).toBeTruthy();
  });

  it('should create claim when form is valid', () => {
    const formData = {
      benefit: 'Short Term Disability',
      fullName: 'John Doe',
      birthDate: '1990-01-01',
      gender: 'Male',
      phoneNumber: '1234567890',
      workPhoneNumber: '0987654321',
      dependants: false,
      roleStartDate: '2023-01-01',
      providerId: 'provider1'
    };

    component.claimForm.patchValue(formData);
    claimsServiceSpy.createClaim.and.returnValue(of(mockClaim));

    component.onSubmit();

    expect(claimsServiceSpy.createClaim).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/claims']);
  });

  it('should handle error when creating claim', () => {
    const formData = {
      benefit: 'Short Term Disability',
      fullName: 'John Doe',
      birthDate: '1990-01-01',
      gender: 'Male',
      phoneNumber: '1234567890',
      workPhoneNumber: '0987654321',
      dependants: false,
      roleStartDate: '2023-01-01',
      providerId: 'provider1'
    };

    component.claimForm.patchValue(formData);
    claimsServiceSpy.createClaim.and.returnValue(throwError(() => new Error('Error creating claim')));

    component.onSubmit();

    expect(component.error).toBe('Failed to create claim');
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(claimsServiceSpy.createClaim).not.toHaveBeenCalled();
  });
});
