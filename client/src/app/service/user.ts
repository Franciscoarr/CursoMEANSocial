import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:3800/api/'
  public identity: any;
  public token: any;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  registrer(user: User): Observable<any>{
    /*let json = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');*/

    return this.http.post(this.url +'register', user);
  }

  signUp(user: User, gettoken: boolean = false): Observable<any>{
    if(gettoken){
      (user as any).gettoken = true;
    }

    return this.http.post(this.url +'login', user);
  }

  getIdentity(): any {
    if (isPlatformBrowser(this.platformId)) { // Solo navegador
      const identity = JSON.parse(localStorage.getItem('identity') || 'null');
      this.identity = identity ?? null;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      this.token = token ?? null;
    } else {
      this.token = null;
    }
    return this.token;
  }

}
