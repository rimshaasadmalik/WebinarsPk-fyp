import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { CommonService } from '../shared/services/common.service';
import { ValidateService } from '../shared/services/validate.service';
import { Person } from './person';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {

    person: Person;
    flag: string;
    name: string;
    email: string;
    phone: string;
    profession: string;
    birthdate: string;
    interests: string;
    registeras: string;
    categories: any[] = []
    password: string;
    confirmpassword: string;
    userId: string;
    otp: number;
    hidden: boolean = true;
    isEmailVerified: boolean = false;


    constructor(
        private authService: AuthService,
        private validateService: ValidateService,
        private commenService: CommonService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.commenService.getCategories().then(cats => { this.categories = cats })
    }

    onOrganizer() { this.flag = 'isOrganizer'; this.hidden = true }
    onViewer() { this.flag = 'isViewer'; this.hidden = false }
    onRegisterAs(value) { value === "isViewer" ? this.hidden = false : this.hidden = true }

    onVerify() {
        if (!this.validateService.validateOTP(this.otp)) return this.toastr.warning('Code must be 4 digit number', 'Validation Error')
        this.authService._Post('auth/register/verify', { userId: this.userId, otp: this.otp }).subscribe(response => {
            if (response.success == true) {
                this.toastr.success(response.message, 'Success')
                this.router.navigate(['/login'])
                this.spinner.hide();
            }
            else {
                console.log(response)
                this.toastr.warning(response.message, 'Warning')
                this.spinner.hide();
            }
        }, error => {
            console.log(error);
            this.spinner.hide();
            this.toastr.error(error.error.message, 'Error')
        })
    }

    onRegister() {
        // console.log({ registeras: this.registeras, interests: this.interests, profession: this.profession });

        if (this.registeras == undefined) return this.toastr.warning('Please select Registration type first', 'Validation Error')
        // if (this.flag == null) return this.toastr.warning('Please select Organizer or Viewer first', 'Validation Error')
        if (!this.email) return this.toastr.warning('Email is not entered', 'Validation Error')
        if (!validateEmail(this.email)) return this.toastr.warning('Email is not in proper format', 'Validation Error')
        if (!this.name) return this.toastr.warning('Please enter name', 'Validation Error')
        if (!this.profession) return this.toastr.warning('Please select profession', 'Validation Error')
        if (!this.validateService.validateName(this.name)) return this.toastr.warning('Name should be string', 'Validation Error')
        if (!this.validateService.validatePassword(this.password)) return this.toastr.warning('Password must be at least 8 alphanumeric characters and contain at least one number', 'Validation Error')
        if (!validate(this.email, this.password)) return this.toastr.warning('Email or Password is missing', 'Validation Error')
        if (this.password != this.confirmpassword) return this.toastr.warning('Confirm Password not matched', 'Validation Error')

        const personObj = {
            flag: this.registeras,
            email: this.email,
            name: this.name,
            password: this.password,
            dob: this.birthdate,
            profession: this.profession,
            interests: this.interests
        }
        this.spinner.show();
        this.authService._Post('auth/register', personObj).subscribe(response => {
            if (response.success == true) {
                this.isEmailVerified = true;
                console.log(response.payload);

                this.userId = response.payload._id
                this.toastr.success(response.message, 'Success')
                this.spinner.hide();
            }
            else {
                console.log(response)
                this.toastr.warning(response.message, 'Warning')
                this.spinner.hide();
            }
        }, error => {
            console.log(error);
            this.spinner.hide();
            this.toastr.error(error.error.message, 'Error')
        })
    }

}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /\d{4}\d{7}/;
    return re.test(phone);
}



function validate(email: string, password: string) {
    if (email == undefined || password == undefined || email == "" || password == "") return false
    else return true
}



// if (!this.validateService.validateName(this.name)) { this.toastr.warning('Name should be string', 'Validation Error'); return false; }
//         if (!validate(this.email, this.password)) { this.toastr.warning('Email or Password is missing', 'Validation Error'); return false; }
//         if (!validateEmail(this.email)) { this.toastr.warning('Email is not in proper format', 'Validation Error'); return false; }
//         if (!this.validateService.validatePhone(this.phone)) { this.toastr.warning('Phone is not in proper format', 'Validation Error'); return false; }
//         if (!this.validateService.validatePassword(this.password)) { this.toastr.warning('Password must be at least 8 alphanumeric characters and contain at least one number', 'Validation Error'); return false; }

//         if (this.password != this.confirmpassword) return this.toastr.warning('Password not matched', 'Error')
//         let ints = []
//         if (!this.hidden) this.interests.forEach(e => { ints.push(e.label) })
//         const personObj = {
//             flag: this.flag,
//             name: this.name,
//             email: this.email,
//             password: this.password,
//             phoneno: this.phone,
//             profession: this.profession,
//             dob: this.birthdate,
//             interests: ints,
//         }
//         console.log(personObj);
//         this.authService._Post('auth/register', personObj).subscribe(response => {
//             if (response.success == true) {
//                 // this.authService.storeUserData(response.token, response.payload)
//                 this.router.navigate(['/login'])
//                 // this.toastr.success(response.message, 'Login Success')
//             }
//             else {
//                 console.log(response)
//                 this.toastr.warning(response.message, 'Warning')
//             }
//         }, error => {
//             console.log(error);
//             this.toastr.error(error.error.message, 'Error')
//         })
