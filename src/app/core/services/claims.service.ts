import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Claim, Comment } from '../models/claim.model';

export interface ClaimsResponse {
  success: boolean;
  message: string;
  data: Claim[];
}

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private apiUrl = `${environment.apiUrl}/claims`;

  constructor(private http: HttpClient) {}

  getClaims(): Observable<Claim[]> {
    return this.http.get<ClaimsResponse>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getClaimById(id: string): Observable<Claim> {
    return this.http.get<{ success: boolean; message: string; data: Claim }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createClaim(claim: Omit<Claim, '_id' | 'createdAt' | 'comments' | 'isDeleted'>): Observable<Claim> {
    return this.http.post<{ success: boolean; message: string; data: Claim }>(this.apiUrl, claim).pipe(
      map(response => response.data)
    );
  }

  updateClaim(id: string, claim: Partial<Claim>): Observable<Claim> {
    return this.http.put<{ success: boolean; message: string; data: Claim }>(`${this.apiUrl}/${id}`, claim).pipe(
      map(response => response.data)
    );
  }

  deleteClaim(id: string): Observable<void> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }

  updateClaimStatus(id: string, status: Claim['status']): Observable<Claim> {
    return this.http.patch<{ success: boolean; message: string; data: Claim }>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(response => response.data)
    );
  }

  addComment(claimId: string, comment: string | { message: string }): Observable<Claim> {
    const payload = typeof comment === 'string' ? { message: comment } : comment;
    return this.http.post<{ success: boolean; message: string; data: Claim }>(`${this.apiUrl}/${claimId}/comments`, payload).pipe(
      map(response => response.data)
    );
  }
}
