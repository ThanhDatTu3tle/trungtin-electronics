import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private apiUrl = `${environment.apiUrl}/uploads/image`;

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token'); // đổi key nếu bạn lưu tên khác
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{ url: string }>(
            this.apiUrl,
            formData,
            { headers: this.getAuthHeaders() }
        );
    }
}
