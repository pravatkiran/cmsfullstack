import { Injectable } from '@angular/core';
import { environment } from 'client/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from './model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  postCustomer(customer:Customer){
    return this.http.post(this.baseUrl + '/createCustomer', customer);
  }

  getCustomers(){
    return this.http.get(this.baseUrl + '/getAll')
  }

  editCustomer(id, customer: Customer){
    return this.http.put(this.baseUrl + '/update/' + id , customer );
  }

  removeCustomer(id){
    return this.http.delete(this.baseUrl + '/delete/' + id);
  }

  fetchByAge(){
    return this.http.get(this.baseUrl + '/getByAge');
  }
}
