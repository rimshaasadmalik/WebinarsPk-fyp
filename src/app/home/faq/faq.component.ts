import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../app/shared/services/auth.service';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

    faqs: any[] = []

    constructor(
        private authService: AuthService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.authService._GetAll('viewer/faq/all').subscribe(response => {
            if (response.success == true) {
                this.faqs = response.payload
                // this.authService.storeUserData(response.token, response.payload)
                // this.router.navigate(['/dashboard'])
                // this.toastr.success(response.message, 'Login Success')
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
