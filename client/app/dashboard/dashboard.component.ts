import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  customers: any;

  constructor(
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.getCustomersByAge();
  }

  customizeTooltip(arg: any) {
    return {
      text: arg.argumentText + ' - ' + arg.valueText
    };
  }

  getCustomersByAge() {
    this.customerService.fetchByAge()
      .subscribe((res: any) => {
        console.log('response', res);
        this.customers = res.customer;
      })
  }
}
