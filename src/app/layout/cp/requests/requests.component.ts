import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../../app/shared/services/auth.service';
import { Request } from '../../models/Request';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

    requests: Request[] = [];
    itemDialog: boolean = false;
    item: Request;
    submitted: boolean = false;
    disabled: boolean = false;
    responded: boolean = false;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.authService._GetAll('admin/contactus/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.responded = false;
                this.requests = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onResponded() {
        this.responded = true;
        this.authService._GetAll('admin/contactus/responded/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.requests = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onUnResponded() { this.ngOnInit(); }

    hideDialog() {
        this.itemDialog = false;
        this.submitted = false;
        this.disabled = false;
    }

    viewItem(item) {
        this.item = { ...item };
        this.itemDialog = true;
        this.disabled = true;
    }

    editItem(item) {
        this.item = { ...item };
        this.itemDialog = true;
    }



    sendResponse() {
        this.authService._Put('admin/contactus/responde', this.item._id, this.item).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.toastr.success(response.message, 'Success')
                this.itemDialog = false;
                this.item = {}
                this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    deleteItem(item) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + item.subject + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.authService._Delete('admin/contactus/delete', item._id).subscribe(response => {
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
