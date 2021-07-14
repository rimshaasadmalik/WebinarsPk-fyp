import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../../app/shared/services/auth.service';
import { Payment } from '../../models/Payment';

@Component({
    selector: 'app-payables',
    templateUrl: './payables.component.html',
    styleUrls: ['./payables.component.scss']
})
export class PayablesComponent implements OnInit {

    payables: Payment[] = [];
    payable: Payment;
    user: any;
    submitted: boolean = false;
    payableEditDialog: boolean = false;
    selectedPayable: Payment;
    debitAmount: number = 0;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.authService._Get(this.user._id, 'client/payment/payables/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.payables = response.payload
                for (let i = 0; i < this.payables.length; i++) {
                    const e = this.payables[i];
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
        this.payableEditDialog = false;
        this.selectedPayable = {};
        this.submitted = false;
    }

    onSettle(payable: Payment) {
        this.payable = { ...payable };
        this.submitted = false
        this.payableEditDialog = true;
    }

    onSettleSave() {
        this.submitted = true;
        // if (this.payable.name.trim())
        if (this.debitAmount > this.payable.net) this.debitAmount = this.payable.net
        this.authService._Put('client/payment/editbypk', this.payable._id, { userId: this.user?._id, debit: this.debitAmount }).subscribe(response => {
            if (response.success == true) {
                this.payableEditDialog = false;
                this.toastr.success(response.message, 'Success')
                this.debitAmount = 0;
                this.ngOnInit();
            }
            else this.toastr.warning(response.message, 'Warning')
        }, error => { this.toastr.error(error.error.message, 'Error') })
    }

}
