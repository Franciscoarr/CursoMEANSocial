import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Publication } from '../models/publication';


@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  url = 'http://localhost:3800/api/'
  public identity: any;
  public token: any;
  public stats: any;

  constructor(private http: HttpClient) {}

  addPublication(token: any, publication: any): Observable<any>{
    let params = JSON.stringify(publication)
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.post(this.url+'publication', params, {headers: headers});
  }

  getPublications(token: any, page = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.get(this.url+'publications/'+page, {headers: headers});
  }

  getPublicationsUser(token: any, user_id: any, page = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.get(this.url+'publications-user/'+user_id+'/'+page, {headers: headers});
  }

  deletePublication(token: any, id: any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.delete(this.url+'publication/'+id, {headers: headers});
  }
}
