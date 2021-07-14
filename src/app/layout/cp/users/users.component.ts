import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../app/shared/services/auth.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    rows: any[];

    constructor(
        private authService: AuthService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.authService._GetAll('admin/users/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.rows = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })

    }

}
