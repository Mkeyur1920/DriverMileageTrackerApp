import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE } from '../../../app.constants';


interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = `${API_BASE}/users`

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http
      .get<any>(`${this.API_URL}/all`)
  }

  getById(id:number):Observable<any>{
    return this.http.get<any>(`${this.API_URL}/${id}`)
  }
  


  
}
