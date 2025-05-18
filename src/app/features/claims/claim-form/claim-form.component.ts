import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProviderService, Provider } from '../../../core/services/provider.service';
import { ClaimsService } from '../../../core/services/claims.service';

interface Claim {
  _id?: string;
  userId: string;
  benefit: string;
  fullName: string;
  birthDate: Date;
  gender: string;
  phoneNumber: string;
  workPhoneNumber: string;
  dependants: boolean;
  roleStartDate: Date;
  providerId: string;
  status: string;
  createdAt: Date;
  comments: { name: string; message: string; createdAt: Date }[];
  isDeleted: boolean;
}

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  claimForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  providers: Provider[] = [];

  benefitOptions = [
    'Short Term Disability',
    'Long Term Disability',
    'Waiver of Premiums',
    'Salary Continuance'
  ];

  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'review', label: 'Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private providerService: ProviderService,
    private claimsService: ClaimsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProviders();
    const claimId = this.route.snapshot.paramMap.get('id');
    if (claimId) {
      this.isEditMode = true;
      this.loadClaim(claimId);
    }
  }

  loadProviders(): void {
    this.isLoading = true;
    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers = providers;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load providers';
        this.isLoading = false;
        console.error('Error loading providers:', error);
      }
    });
  }

  initForm(): void {
    this.claimForm = this.fb.group({
      benefit: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      workPhoneNumber: [''],
      dependants: [false],
      roleStartDate: ['', [Validators.required]],
      providerId: ['', [Validators.required]]
    });
  }

  loadClaim(id: string): void {
    this.isLoading = true;
    this.claimsService.getClaimById(id).subscribe({
      next: (claim) => {
        this.claimForm.patchValue({
          benefit: claim.benefit,
          fullName: claim.fullName,
          birthDate: claim.birthDate,
          gender: claim.gender,
          phoneNumber: claim.phoneNumber,
          workPhoneNumber: claim.workPhoneNumber,
          dependants: claim.dependants,
          roleStartDate: claim.roleStartDate,
          providerId: claim.providerId
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load claim';
        this.isLoading = false;
        console.error('Error loading claim:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.claimForm.value;

    if (this.isEditMode) {
      const claimId = this.route.snapshot.paramMap.get('id');
      if (claimId) {
        this.claimsService.updateClaim(claimId, formValue).subscribe({
          next: () => {
            this.router.navigate(['/claims']);
          },
          error: (error) => {
            this.error = 'Failed to update claim';
            this.isLoading = false;
            console.error('Error updating claim:', error);
          }
        });
      }
    } else {
      this.claimsService.createClaim(formValue).subscribe({
        next: () => {
          this.router.navigate(['/claims']);
        },
        error: (error) => {
          this.error = 'Failed to create claim';
          this.isLoading = false;
          console.error('Error creating claim:', error);
        }
      });
    }
  }

  get benefit() { return this.claimForm.get('benefit'); }
  get fullName() { return this.claimForm.get('fullName'); }
  get birthDate() { return this.claimForm.get('birthDate'); }
  get gender() { return this.claimForm.get('gender'); }
  get phoneNumber() { return this.claimForm.get('phoneNumber'); }
  get workPhoneNumber() { return this.claimForm.get('workPhoneNumber'); }
  get dependants() { return this.claimForm.get('dependants'); }
  get roleStartDate() { return this.claimForm.get('roleStartDate'); }
  get providerId() { return this.claimForm.get('providerId'); }
}
