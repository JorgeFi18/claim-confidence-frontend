import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClaimsService } from '../../../core/services/claims.service';
import { LogService, Log } from '../../../core/services/log.service';
import { Claim } from '../../../core/models/claim.model';
import { AuthService } from '../../../core/services/auth.service';

export enum ClaimStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  REVIEW = 'review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TitleCasePipe],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.css'
})
export class ClaimDetailComponent implements OnInit {
  claim: Claim | null = null;
  logs: Log[] = [];
  isLoading = true;
  error: string | null = null;
  commentForm: FormGroup;
  isManager = false;
  claimStatuses = Object.values(ClaimStatus);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimsService: ClaimsService,
    private logService: LogService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    if (claimId) {
      this.loadClaim(claimId);
      this.loadLogs(claimId);
      this.checkUserRole();
    }
  }

  checkUserRole(): void {
    const user = this.authService.getCurrentUser();
    this.isManager = user?.role === 'manager';
  }

  loadClaim(id: string): void {
    this.isLoading = true;
    this.claimsService.getClaimById(id).subscribe({
      next: (claim) => {
        this.claim = claim;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error loading claim details';
        this.isLoading = false;
        console.error('Error loading claim:', error);
      }
    });
  }

  loadLogs(claimId: string): void {
    console.log('Loading logs for claim:', claimId);
    this.logService.getClaimLogs(claimId).subscribe({
      next: (logs) => {
        console.log('Logs received:', logs);
        this.logs = logs;
      },
      error: (error) => {
        console.error('Error loading logs:', error);
        this.error = 'Error loading activity logs';
      }
    });
  }

  updateClaimStatus(newStatus: ClaimStatus): void {
    if (!this.claim || !this.isManager) return;

    this.claimsService.updateClaimStatus(this.claim._id, newStatus).subscribe({
      next: () => {
        this.loadClaim(this.claim!._id);
        this.loadLogs(this.claim!._id);
      },
      error: (error) => {
        console.error('Error updating claim status:', error);
        this.error = 'Error updating claim status';
      }
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.claim) {
      const comment = this.commentForm.get('message')?.value;
      this.claimsService.addComment(this.claim._id, comment).subscribe({
        next: () => {
          this.commentForm.reset();
          this.loadClaim(this.claim!._id);
          this.loadLogs(this.claim!._id);
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  get message() {
    return this.commentForm.get('message');
  }
}
