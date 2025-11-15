import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EncodeRequest {
  image: File;
  message: string;
  addPrompt: boolean;
}

export interface DecodeRequest {
  image: File;
}

export interface DecodeResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SteganographyService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
    // Use localhost API URL in development
    if (window.location.hostname === 'localhost' && window.location.port === '4200') {
      this.apiUrl = 'http://localhost:3000/api';
    }
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  encode(request: EncodeRequest): Observable<Blob> {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('message', request.message);
    formData.append('addPrompt', request.addPrompt.toString());

    console.log('Sending encode request with message:', request.message);
    console.log('FormData contents:');
    for (let pair of (formData as any).entries()) {
      console.log('  ' + pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    return this.http.post(`${this.apiUrl}/encode`, formData, { responseType: 'blob' });
  }

  decode(request: DecodeRequest): Observable<DecodeResponse> {
    const formData = new FormData();
    formData.append('image', request.image);

    return this.http.post<DecodeResponse>(`${this.apiUrl}/decode`, formData);
  }
}

