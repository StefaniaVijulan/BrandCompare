import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseUrl = environment.baseUrl;
  private publicHtttpHeader ={
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  private privateHttpHeaders = {
    headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer API_KEY_TEST'})
  }
  
  constructor(private http:HttpClient) { }
  
  getAllInfo(){
    return this.http.get(this.baseUrl+"/info", this.privateHttpHeaders)
  }
}
