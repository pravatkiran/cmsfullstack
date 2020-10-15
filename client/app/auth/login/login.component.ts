import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'client/app/user.service';
import { error } from 'util';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userId: string;
  submitted = false;

  login_form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get f() {
    return this.login_form.controls;
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }


  loginUser() {
    this.submitted = true;
    if (this.login_form.invalid) return;
    this.authService.login(this.login_form.value)
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          console.log('response', res);
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.userId = res.id;
          console.log('userId', this.userId);
          this.router.navigateByUrl('/dashboard');
        }
      },
        (error) => {
          console.log('Error', error);
          this.toastr.error('Invalid email or password.');
        }
      )

  }

  signUp() {
    this.router.navigateByUrl('/signup');
  }

  resetForm() {
    this.login_form.reset();
  }


}
