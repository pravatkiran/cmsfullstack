import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {

  createModal: boolean = false;
  updateModal: boolean = false;
  closeResult: any = '';

  customers:any;


  customerForm = new FormGroup({
    customerid: new FormControl(''),
    name: new FormControl(''),
    address: new FormControl(''),
    phone_number: new FormControl(''),
    dob: new FormControl('')
  })
  submitted: boolean;

  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.getCustomers();
  }

  openCreate(content) {
    this.createModal = true;
    this.submitted = false;
    this.customerForm.reset();
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getCreateDismissReason(reason)}`;
    });
  }

  private getCreateDismissReason(reason: any) {
    this.createModal = false;
  }

  cancel() {
    this.modalService.dismissAll();
  }

  openUpdate(content, customer) {
    this.updateModal = true;
    this.submitted = false;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getUpdateDismissReason(reason)}`;
    });

    this.customerForm.controls['customerid'].setValue(
      customer.customerid
    )

    this.customerForm.controls['name'].setValue(
      customer.name
    );
    this.customerForm.controls['address'].setValue(
      customer.address
    );
    this.customerForm.controls['phone_number'].setValue(
      customer.phone_number
    );
    this.customerForm.controls['dob'].setValue(
      customer.dob
    )
  }

  private getUpdateDismissReason(reason: any) {
    this.updateModal = false;
  }


  getCustomers(){
    this.customerService.getCustomers().subscribe
    ((res:any)=>{
      console.log('res', res);
      this.customers = res.customer;
    })
  }


  createCustomer(){
    this.submitted = true;
    let data = this.customerForm.value;

    if(this.customerForm.invalid){
      return;
    }

    this.customerService.postCustomer(data).subscribe
    ((res:any)=>{
      console.log('res', res);
      this.getCustomers();
      this.submitted = false;
      this.toastr.success('Customer created successfully.');
      this.customerForm.reset();
      this.cancel();
    })
  }

  updateCustomer(){
    this.submitted = true;
    this.customerService.editCustomer(this.customerForm.value.customerid, this.customerForm.value)
    .subscribe((res:any)=>{
      console.log('response', res);
      this.getCustomers();
      this.submitted = false;
      this.toastr.success('Customer updated successfully.');
      this.customerForm.reset();
      this.cancel();
    })
  }

  delete(id){
    if(confirm('Do you want to delete this customer?')){
      this.customerService.removeCustomer(id).subscribe((res:any)=>{
        console.log('response',res);
        this.getCustomers();
        this.toastr.success('Customer deleted successfully.');
      })
    }
  }

}
