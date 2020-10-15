import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user.model';
import { environment } from 'client/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }


  public get currentUserValue(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  login(user: User){
    return this.http.post(this.baseUrl + '/login', user);
  }

  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
  }

  public get loggedIn():boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
