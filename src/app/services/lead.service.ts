import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  
  // TO DO: Replace with your actual Google Form Action URL
  private readonly GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdy8sQOPxUnK-9L29eF8tEJHoghIa1Ew0SX2qnh98hEZN1HTw/formResponse';

  private readonly GoogleSheetAppScriptUrl = 'https://script.google.com/macros/s/AKfycbyMN6vKfJ6YDNHEMPz-XJiWs4gd6GbnmXMBsJAEeW2_7A7za6Ajo_AWrUqXzMdHZNiiXA/exec';
  // Mapping of form fields to Google Entry IDs
  private readonly ENTRY_IDS = {
    name: 'entry.694821300',
    email: 'entry.1208457199',
    mobile: 'entry.789081934',
    project: 'entry.529427854',
    billAmount: 'entry.1570199244'
  };

  submitLead(formData: any): Observable<boolean> {
    const params = new HttpParams()
      .set(this.ENTRY_IDS.name, formData.name)
      .set(this.ENTRY_IDS.email, formData.email)
      .set(this.ENTRY_IDS.mobile, formData.phone)
      .set(this.ENTRY_IDS.project, formData.projectType)
      .set(this.ENTRY_IDS.billAmount, formData.avgBill);

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
