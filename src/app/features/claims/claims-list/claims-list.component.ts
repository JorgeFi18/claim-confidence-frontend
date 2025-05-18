import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimsService } from '../../../core/services/claims.service';
import { Claim } from '../../../core/models/claim.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-claims-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.css']
})
export class ClaimsListComponent implements OnInit {
  claims: Claim[] = [];
  isLoading = false;
  error: string | null = null;
  isClaimant = false;

  constructor(
    private claimsService: ClaimsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClaims();
    this.checkUserRole();
  }

  checkUserRole(): void {
    const user = this.authService.getCurrentUser();
    this.isClaimant = user?.role === 'claimant';
  }

  loadClaims(): void {
    this.isLoading = true;
    this.error = null;

    this.claimsService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message || 'Error loading claims';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      default:
        return 'bg-green-100 text-green-800';
    }
  }
}
