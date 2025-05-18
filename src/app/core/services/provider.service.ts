import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Provider {
  _id: string;
  name: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) {}

  getProviders(): Observable<Provider[]> {
    return this.http.get<ApiResponse<Provider[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
} 