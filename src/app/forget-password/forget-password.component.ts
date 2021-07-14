import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { CommonService } from '../shared/services/common.service';
import { ValidateService } from '../shared/services/validate.service';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.scss'],
    animations: [routerTransition()]
})
export class ForgetPasswordComponent implements OnInit {

    email: string;
    otp: number;
    password: string;
    confirmpassword: string;
    submitted: boolean = false;

    constructor(
        private authService: AuthService,
        private validateService: ValidateService,
        private commenService: CommonService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
    }

    haveOTP() {
        if (!this.validateService.validateEmail(this.email)) { return this.toastr.warning('Please enter Email', 'Warning') }
        this.submitted = true
    }
    onSubmit() {
        if (!this.validateService.validateEmail(this.email)) {
            this.toastr.warning('Please enter a valid Email', 'Warning')
            return false;
        }
        this.spinner.show();
        this.authService._Post('auth/forget-password', { email: this.email }).subscribe(response => {
            if (response.success == true) {
                this.submitted = true;
                this.toastr.success(response.message, 'Success')
                this.spinner.hide();
            }
            else { console.log(response); this.spinner.hide(); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.spinner.hide(); this.toastr.error(error.error.message, 'Error') })
    }

    onReset() {
        if (!this.validateService.validateEmail(this.email)) { this.toastr.warning('Please enter a valid Email', 'Warning'); return false; }
        if (!this.validateService.validatePassword(this.password)) { this.toastr.warning('Password must be at least 8 alphanumeric characters and contain at least one number', 'Warning'); return false; }
        if (!this.validateService.validateOTP(this.otp)) { this.toastr.warning('OTP must be 4 digit number', 'Warning'); return false; }
        if (this.password != this.confirmpassword) return this.toastr.warning('Password not matched', 'Error')
        const data = {
            email: this.email,
            otp: this.otp,
            password: this.password
        }
        this.authService._Post('auth/reset-password', data).subscribe(response => {
            if (response.success == true) {
                this.router.navigate(['/login']);
                this.submitted = false
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

}
