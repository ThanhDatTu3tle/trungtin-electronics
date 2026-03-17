import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
    const params = new URLSearchParams({
      name, description: description || '',
      discountPercent: discountPercent.toString(),
      colorTheme: colorTheme || '',
      bannerUrl: bannerUrl || '',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: isActive.toString()
    });
    return this.http.post(`${this.apiUrl}/Events/CreateEvent?${params}`, {});
  }

  updateEvent(
    eventId: number, name: any, description: any, discountPercent: any,
    colorTheme: any, bannerUrl: any, startDate: any, endDate: any,
    isActive: any, action: string = 'update'
  ) {
    let url = `${this.apiUrl}/Events/UpdateEvent?eventId=${eventId}&action=${action}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (description) url += `&description=${encodeURIComponent(description)}`;
    if (discountPercent != null) url += `&discountPercent=${discountPercent}`;
    if (colorTheme) url += `&colorTheme=${encodeURIComponent(colorTheme)}`;
    if (bannerUrl) url += `&bannerUrl=${encodeURIComponent(bannerUrl)}`;
    if (startDate) url += `&startDate=${new Date(startDate).toISOString()}`;
    if (endDate) url += `&endDate=${new Date(endDate).toISOString()}`;
    if (isActive != null) url += `&isActive=${isActive}`;
    return this.http.post(url, {});
  }

  assignProductToEvent(productId: number, eventId: number | null) {
    let url = `${this.apiUrl}/Events/AssignProductToEvent?productId=${productId}`;
    if (eventId != null) url += `&eventId=${eventId}`;
    return this.http.post(url, {});
  }
}
