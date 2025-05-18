import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Log {
  _id: string;
  userId: string;
  claimId: string;
  action: string;
  date: string;
}

interface LogsResponse {
  success: boolean;
  message: string;
  data: Log[];
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  getClaimLogs(claimId: string): Observable<Log[]> {
    return this.http.get<LogsResponse>(`${this.apiUrl}/claim/${claimId}`).pipe(
      map(response => response.data)
    );
  }

  getUserClaimLogs(claimId: string): Observable<Log[]> {
    return this.http.get<LogsResponse>(`${this.apiUrl}/claim/${claimId}/user`).pipe(
      map(response => response.data)
    );
  }
} 