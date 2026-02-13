import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';
import { application } from 'express';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:3800/api/'
  public identity: any;
  public token: any;
  public stats: any;

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

  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      this.token = token ?? null;
    } else {
      this.token = null;
    }
    return this.token;
  }

  getStats(): any{
    if (isPlatformBrowser(this.platformId)) { // Solo navegador
      const stats = JSON.parse(localStorage.getItem('stats') || 'null');
      this.stats = stats ?? null;
    } else {
      this.stats = null;
    }
    return this.stats;
  }

  getCounters(userId: string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',this.getToken());

    if (userId != null){
      return this.http.get(this.url +'counters/'+userId, {headers: headers});
    }else{
      return this.http.get(this.url +'counters', {headers: headers});
    }
    
  }

}
