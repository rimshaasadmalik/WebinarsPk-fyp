import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    email: string;
    password: string;
    fcmToken: string;

    constructor(
        public router: Router,
        private authService: AuthService,
        private toastr: ToastrService
    ) {
        this.fcmToken = window.sessionStorage.getItem('fcm_token')
        // console.log(this.fcmToken);

    }

    ngOnInit() {
    }

    onLoggedin() {

        if (!validate(this.email, this.password)) {
            this.toastr.warning('Email or Password is missing', 'Input Validation Error')
            return false;
        }
        if (!validateEmail(this.email)) {
            this.toastr.warning('Email is not in proper format', 'Validation Error')
            return false;
        }
        const credentials = {
            email: this.email,
            password: this.password
        }
        console.log(credentials);
        this.authService._Post('auth/login', credentials).subscribe(response => {
            if (response.success == true) {
                this.authService.storeUserData(response.token, response.payload)
                this.router.navigate(['/dashboard'])
                // this.toastr.success(response.message, 'Login Success')
            }
            else {
                console.log(response);
                this.toastr.warning(response.message, 'Login Failure')
            }
        }, error => {
            console.log(error);
            this.toastr.error(error.error.message, 'Error')
        })

    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validate(email: string, password: string) {
    if (email == undefined || password == undefined || email == "" || password == "") return false
    else return true
}
