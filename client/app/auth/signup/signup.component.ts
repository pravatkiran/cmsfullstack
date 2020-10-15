import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'client/app/user.service';
import { User } from 'client/app/model/user.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User[] = [];
  submitted = false;

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
  }

  get f() {
    return this.signupForm.controls;
  }

  saveUser() {
    this.submitted = true;
    console.log('posted data: ', this.signupForm.value);
    localStorage.removeItem('currentUser');
    if (this.signupForm.invalid) {
      return;
    }
    console.log('submitted');
    this.userService.postUser(this.signupForm.value)
      .subscribe((response: any) => {
        console.log('response', response);
        if (response.status == 'ok') {
          this.user.push(response.user);
          this.router.navigateByUrl('/login');
        }
      },
      (error)=>{
        console.log('Error', error);
        this.toastr.error('Email already exists.');
      }
      )

  }

  resetForm() {
    this.signupForm.reset();
  }

  login() {
    this.router.navigateByUrl('/login');
  }

}
