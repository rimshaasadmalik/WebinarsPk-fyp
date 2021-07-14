import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../app/shared/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Faq } from '../../models/Faq';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

    faqs: any[] = [];
    itemDialog: boolean = false;
    itemAddDialog: boolean = false;
    item: Faq;
    submitted: boolean = false;
    disabled: boolean = false;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.authService._GetAll('admin/faq/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.faqs = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    openNew() {
        this.item = {};
        this.submitted = false;
        this.itemAddDialog = true;
    }

    hideDialog() {
        this.itemAddDialog = false;
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

    saveItem() {
        this.authService._Post('admin/faq/add', this.item).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.toastr.success(response.message, 'Success')
                this.itemAddDialog = false;
                this.item = {}
                this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    updateItem() {
        this.authService._Put('admin/faq/edit', this.item._id, this.item).subscribe(response => {
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
            message: 'Are you sure you want to delete ' + item.title + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.authService._Delete('admin/faq/delete', item._id).subscribe(response => {
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
