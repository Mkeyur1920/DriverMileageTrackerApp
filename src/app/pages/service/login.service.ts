import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE } from '../../../app.constants';
import { RegisterDTO } from '../../dto/register.dto';


interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API_URL = `${API_BASE}/auth`

  constructor(private http: HttpClient) {}

  login(phoneNumber: string, vehicleNumber: string,password:string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, { phoneNumber, vehicleNumber,password }, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<LoginResponse>) => {
          if (res.status === 200 && res.body?.token) {
            localStorage.setItem('authToken', res.body.token);
            localStorage.setItem('user', JSON.stringify(res.body));
            return true;
          }
          return false;
        })
      );
  }
  public register(dto :RegisterDTO):Observable<any> {
    return this.http.post<RegisterDTO>(`${this.API_URL}/register`,{dto},{ observe: 'response' })
    .pipe(
      map((res:HttpResponse<RegisterDTO>)=>{
        if(res.status === 200 ){
          return res
        }
        return false;
      })
    )
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  public get isAuthenticated(): boolean {
    return localStorage.getItem('authToken') != null;
  }

  public getUser(): any {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  
}
