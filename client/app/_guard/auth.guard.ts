import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { state } from '@angular/animations';

@Injectable({ providedIn: 'root'})

export class AuthGuard implements CanActivate {

    constructor(
        private router : Router,
        private authService : AuthService
    ){

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    )  {
        const currentUser = this.authService.currentUserValue;
        if(currentUser){

            // authorized so return true;
            return true;
        }

        // not logged in so redirect to login page with return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }


    // checkLogin(url:string):boolean {
    //     console.log('isLoggedIn status from auth guard', this.authService.loggedIn);
    //     // if(this.authService.loggedIn) return true;

    //     // store the attempted url for redirecting
    //     // this.userService.redirectUrl = url;

    //     // navigate to login page  with extras
    //     // this.router.navigateByUrl('/login');  

    //     const currentUser = this.authService.currentUserValue;

    //     if(currentUser){
    //         return true;
    //     }

    //     // not logged in so redirect to login page with the return url
    //     this.router.navigate(['/login'], {queryParams: {returnUrl: state.(this.url)}})
    //     return false;
    // }

}