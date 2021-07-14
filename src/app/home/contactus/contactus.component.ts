import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../app/shared/services/auth.service';
import { ValidateService } from '../../../app/shared/services/validate.service';

@Component({
    selector: 'app-contactus',
    templateUrl: './contactus.component.html',
    styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

    name: string;
    email: string;
    subject: string;
    message: string;
    city: string;
    zip: number;
    display: boolean = false;
    disabled: boolean = true;

    constructor(
        private authService: AuthService,
        private validateService: ValidateService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.name = "";
        this.email = "";
        this.subject = "";
        this.message = "";
        this.city = "";
        this.zip = null;
    }

    showDialog() {
        if (this.name.trim(), this.email.trim(), this.subject.trim(), this.message.trim(), this.city.trim(), this.zip) this.display = true
    }
    showResponse(ev) { this.disabled = false }

    onSubmit() {
        // if (this.disabled == true) return
        if (!this.name || !this.email || !this.subject || !this.message || !this.city || !this.zip) return this.toastr.warning('Please fill up form', 'Validation Error')
        if (!this.validateService.validateName(this.name)) return this.toastr.warning('Name should be string', 'Validation Error')
        if (!this.validateService.validateEmail(this.email)) return this.toastr.warning('Email is not in proper format', 'Validation Error')
        if (!this.validateService.validateName(this.subject)) return this.toastr.warning('Subject should be string', 'Validation Error')
        if (!this.validateService.validateName(this.city)) return this.toastr.warning('City should be string', 'Validation Error')
        if (!this.validateService.validateZip(this.zip)) return this.toastr.warning('Zip should be 5 Digit Number', 'Validation Error')

        if (this.name.trim(), this.email.trim(), this.subject.trim(), this.message.trim(), this.city.trim(), this.zip) {
            this.authService._Post('viewer/contactus/add', { name: this.name, email: this.email, subject: this.subject, message: this.message, city: this.city, zip: this.zip }).subscribe(response => {
                if (response.success == true) {
                    this.toastr.success(response.message, 'Success')
                    this.display = false;
                    this.ngOnInit();
                }
                else {
                    console.log(response);
                    this.toastr.warning(response.message, 'Warning')
                }
            }, error => {
                console.log(error);
                this.toastr.error(error.error.message, 'Error')
            })
        }
    }
}
