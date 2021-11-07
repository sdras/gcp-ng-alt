import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3000/analysis";

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendRequest(img: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.httpClient.post(this.REST_API_SERVER, JSON.stringify(img),
      options).pipe(retry(3), catchError(this.handleError));

    // let params = new HttpParams().set('image', img);
    // return this.httpClient.get(this.REST_API_SERVER, { params: params }).pipe(retry(3), catchError(this.handleError));
  }
}