import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getActiveEvents() {
    return this.http.post(`${this.apiUrl}/Events/GetActiveEvents`, {});
  }

  getAllEvents(isActive?: boolean) {
    let url = `${this.apiUrl}/Events/GetAllEvents`;
    if (isActive !== undefined) url += `?isActive=${isActive}`;
    return this.http.post(url, {});
  }

  createEvent(
    name: string, description: string, discountPercent: number,
    colorTheme: string, bannerUrl: string, startDate: Date,
    endDate: Date, isActive: boolean
  ) {
    return this.http.post(`${this.apiUrl}/Events/CreateEvent`, {
      name, description, discountPercent, colorTheme,
      bannerUrl, startDate, endDate, isActive
    });
  }

  updateEvent(
    eventId: number, name: any, description: any, discountPercent: any,
    colorTheme: any, bannerUrl: any, startDate: any, endDate: any,
    isActive: any, action: string = 'update'
  ) {
    return this.http.post(`${this.apiUrl}/Events/UpdateEvent`, {
      eventId, name, description, discountPercent, colorTheme,
      bannerUrl, startDate, endDate, isActive, action
    });
  }

  assignProductToEvent(productId: number, eventId: number | null) {
    return this.http.post(`${this.apiUrl}/Events/AssignProductToEvent`, {
      productId, eventId
    });
  }
}
