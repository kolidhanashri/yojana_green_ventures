import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  
  private readonly GOOGLE_FORM_URL = environment.googleFormUrl;
  private readonly GoogleSheetAppScriptUrl = environment.googleSheetScriptUrl;
  private readonly ENTRY_IDS = environment.entryIds;

  submitLead(formData: any): Observable<boolean> {
    const params = new HttpParams()
      .set(this.ENTRY_IDS.name, formData.name || '')
      .set(this.ENTRY_IDS.city, formData.city || '')
      .set(this.ENTRY_IDS.email, formData.email || '')
      .set(this.ENTRY_IDS.mobile, formData.phone || '')
      .set(this.ENTRY_IDS.project, formData.projectType || '')
      .set(this.ENTRY_IDS.billAmount, formData.avgBill?.toString() || '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // We use responseType: 'text' because Google Form response is not JSON
    return this.http.post(this.GOOGLE_FORM_URL, params.toString(), {
      headers: headers,
      responseType: 'text'
    }).pipe(
      map(() => true),
      catchError((error) => {
        // Status 0 usually indicates a CORS error when the request was successfully dispatched.
        // Google Forms do not return CORS headers, so the browser blocks the response, 
        // but the data is still recorded on Google's end.
        if (error.status === 0 || error.status === 200) {
          return of(true);
        }
        // In case of actual network failure or other errors, you could return false or throw
        return of(true); // Default to true as per your requirement to handle it silently
      })
    );
  }
}
