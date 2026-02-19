import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Follow } from '../models/follow';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FollowService { 
  url = 'http://localhost:3800/api/'

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  addFollow(token : any, follow: any): Observable<any>{
    let params = JSON.stringify(follow)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.post(this.url+'follow', params, {headers: headers});
  }

  deleteFollow(token : any, id: any){
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.delete(this.url+'follow/'+id, {headers: headers});
  }

  getFollowing(token: any, userId = null, page = 1): Observable<any>{
     let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

     var url = this.url+'following/'+userId+'/'+page;
     if(userId != null){
      return this.http.get(url, {headers: headers});
     }

     return EMPTY;
  }

  getFollowed(token: any, userId = null, page = 1): Observable<any>{
     let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

     var url = this.url+'followed/'+userId+'/'+page;
     if(userId != null){
      return this.http.get(url, {headers: headers});
     }

     return EMPTY;
  }

  getMyFollows(token: any): Observable<any>{
     let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

     return this.http.get(this.url+'get-my-follow/true', {headers: headers});
  }
  
}
