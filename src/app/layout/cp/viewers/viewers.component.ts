import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../../app/shared/services/auth.service';

@Component({
    selector: 'app-viewers',
    templateUrl: './viewers.component.html',
    styleUrls: ['./viewers.component.scss']
})
export class ViewersComponent implements OnInit {

    rows: any[];
    item: any;
    itemDialog: boolean = false;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.authService._GetAll('admin/viewers/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.rows = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    editItem(item) {
        this.item = { ...item };
        this.confirmationService.confirm({
            message: 'Are you sure you want to Deactivate Viewer ' + item.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.authService._Put('admin/viewer/deactivate', item.userId, {}).subscribe(response => {
                    if (response.success == true) {
                        // console.log(response.payload);
                        this.toastr.success(response.message, 'Success')
                        this.ngOnInit();
                    }
                    else { console.log(response); this.toastr.warning(response.message, 'Warning') }
                }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
            }
        });
    }

    activateItem(item) {
        this.item = { ...item };
        this.confirmationService.confirm({
            message: 'Are you sure you want to Activate Viewer ' + item.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.authService._Put('admin/viewer/activate', item.userId, {}).subscribe(response => {
                    if (response.success == true) {
                        // console.log(response.payload);
                        this.toastr.success(response.message, 'Success')
                        this.ngOnInit();
                    }
                    else { console.log(response); this.toastr.warning(response.message, 'Warning') }
                }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
            }
        });
    }

}
