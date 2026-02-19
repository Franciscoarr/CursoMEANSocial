import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public url = 'http://localhost:3800/api/'
  constructor(private _http: HttpClient){

  }

  addMessage(token:any, message:any): Observable<any>{
    let params = JSON.stringify(message);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',token);

    return this._http.post(this.url+'message', params, {headers: headers});
  }

  getMyMessage(token:any, page=null): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',token);

    return this._http.get(this.url+'my-messages/'+page, {headers: headers});
  }

  getEmmitMessage(token:any, page=null): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',token);

    return this._http.get(this.url+'messages/'+page, {headers: headers});
  }
}
