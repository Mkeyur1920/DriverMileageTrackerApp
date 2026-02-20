import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterDTO } from '../../dto/register.dto';
import { environment } from '../../../environments/environment';

interface UserRole {
  id?: number;
  roleName?: string;
}

interface UserProfile {
  id: number;
  name: string;
  phoneNumber: string;
  vehicleNumber: string;
  roles: UserRole[];
  signature?: string | null;
  userPhoto?: string | null;
}

interface FlatLoginResponse extends UserProfile {
  token: string;
  password?: string;
}

interface WrappedLoginResponse {
  token: string;
  user: UserProfile;
}

type LoginResponse = FlatLoginResponse | WrappedLoginResponse;

interface NormalizedLoginPayload {
  token: string;
  user: UserProfile;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly API_URL = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(
    phoneNumber: string,
    vehicleNumber: string,
    password: string,
  ): Observable<boolean> {
    return this.http
      .post<LoginResponse>(
        `${this.API_URL}/login`,
        { phoneNumber, vehicleNumber, password },
        { observe: 'response' },
      )
      .pipe(
        map((res: HttpResponse<LoginResponse>) => {
          const payload = this.normalizeLoginPayload(res.body);

          if (res.status === 200 && payload?.token) {
            localStorage.setItem('authToken', payload.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
            return true;
          }

          this.logout();
          return false;
        }),
      );
  }
  public register(dto: RegisterDTO): Observable<any> {
    return this.http
      .post<RegisterDTO>(
        `${this.API_URL}/register`,
        { dto },
        { observe: 'response' },
      )
      .pipe(
        map((res: HttpResponse<RegisterDTO>) => {
          if (res.status === 200) {
            return res;
          }
          return false;
        }),
      );
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
    if (!u) {
      return null;
    }

    const parsedUser = JSON.parse(u);
    return parsedUser?.user ? parsedUser.user : parsedUser;
  }

  public getRoles(): string[] {
    const user = this.getUser();
    if (!user?.roles || !Array.isArray(user.roles)) {
      return [];
    }

    return user.roles
      .map((role: any) =>
        typeof role === 'string' ? role : role?.roleName,
      )
      .filter(Boolean);
  }

  public hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  private normalizeLoginPayload(
    body: LoginResponse | null,
  ): NormalizedLoginPayload | null {
    if (!body || !('token' in body) || !body.token) {
      return null;
    }

    if ('user' in body && body.user) {
      return {
        token: body.token,
        user: this.sanitizeUser(body.user),
      };
    }

    return {
      token: body.token,
      user: this.sanitizeUser(body as FlatLoginResponse),
    };
  }

  private sanitizeUser(rawUser: any): UserProfile {
    return {
      id: rawUser?.id,
      name: rawUser?.name ?? '',
      phoneNumber: rawUser?.phoneNumber ?? '',
      vehicleNumber: rawUser?.vehicleNumber ?? '',
      roles: Array.isArray(rawUser?.roles) ? rawUser.roles : [],
      signature: rawUser?.signature ?? null,
      userPhoto: rawUser?.userPhoto ?? null,
    };
  }
}
