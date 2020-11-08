import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';  
  
@Injectable({  
  providedIn: 'root'  
})  
export class DataService {  
  
  constructor(private http: HttpClient) { }  
  private url: string = "https://api.covid19api.com/summary";  
   
  getData(): Observable<any> {
    return this.http.get(this.url);
  } 
}  