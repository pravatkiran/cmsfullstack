import { Injectable } from '@angular/core';
import { User } from './model/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'client/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
  ) {

  }


  postUser(user: User) {
    console.log('user', user);
    return this.http.post(this.baseUrl + '/signup', user);
  }


}
