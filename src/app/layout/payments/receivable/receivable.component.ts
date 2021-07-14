import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '.././../../../app/shared/services/auth.service';
import { Payment } from '../../models/Payment';

@Component({
    selector: 'app-receivable',
    templateUrl: './receivable.component.html',
    styleUrls: ['./receivable.component.scss']
})
export class ReceivableComponent implements OnInit {


    receivables: Payment[] = [];
    receivable: Payment;
    user: any;
    submitted: boolean = false;
    receivableEditDialog: boolean = false;
    selectedPayable: Payment;
    debitAmount: number = 0;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.authService._Get(this.user._id, 'client/payment/receivables/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.receivables = response.payload
                for (let i = 0; i < this.receivables.length; i++) {
                    const e = this.receivables[i];
                    e.credit - e.debit <= 0 ? e.settled = true : e.settled = false
                    e.net = e.credit - e.debit
                }
            }
            else {
                // console.log(response)
                this.toastr.warning(response.message, 'Warning')
            }
        }, error => { this.toastr.warning(error.error.message, 'Error') })

    }

    hideDialog() {
        this.receivableEditDialog = false;
        this.selectedPayable = {};
        this.submitted = false;
    }

    onSettle(receivable: Payment) {
        this.receivable = { ...receivable };
        this.submitted = false
        this.receivableEditDialog = true;
    }

    onSettleSave() {
        this.submitted = true;
        // if (this.payable.name.trim())
        if (this.debitAmount > this.receivable.net) this.debitAmount = this.receivable.net
        this.authService._Put('client/payment/editbypk', this.receivable._id, { userId: this.user?._id, debit: this.debitAmount }).subscribe(response => {
            if (response.success == true) {
                this.receivableEditDialog = false;
                this.toastr.success(response.message, 'Success')
                this.debitAmount = 0;
                this.ngOnInit();
            }
            else this.toastr.warning(response.message, 'Warning')
        }, error => { this.toastr.error(error.error.message, 'Error') })
    }

}
