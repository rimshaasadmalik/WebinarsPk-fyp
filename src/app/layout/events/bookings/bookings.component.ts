import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../app/shared/services/auth.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
    styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

    id: any;
    bookings: any[] = [];
    paymentDialog: boolean = false;
    isFree: boolean = false;
    isPaid: boolean = false;
    amount: number = 0;
    paymentAmount: number = 0;
    pendingAmount: number = 0;
    selectedItem: any;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')
        this.authService._Get(this.id, 'organizer/bookings/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.paymentAmount = 0;
                this.pendingAmount = 0;
                response.payload[0]?.event?.amount == 0 ? this.isFree = true : this.isFree = false
                response.payload[0]?.event?.amount != 0 ? this.isPaid = true : this.isPaid = false
                // console.log(this.isFree, this.isPaid);

                for (let i = 0; i < response.payload.length; i++) {
                    const e = response.payload[i];
                    // e.amount == 0 ? this.isFree = true : this.isFree = false
                    this.paymentAmount += parseFloat(e?.payment?.amount)
                    this.pendingAmount += (parseFloat(e?.payment?.amount) - parseFloat(e?.payment?.paidAmount))
                    e.amount = (parseFloat(e?.payment?.amount) - parseFloat(e?.payment?.paidAmount))
                    e.e?.payment?.amount - e?.payment?.paidAmount == 0 ? e.disabled = true : e.disabled = false
                    if (e?.payment?.receipt !== undefined) e.receipt = `assets/images/receipts/${e?.payment?.receipt}`
                    else e.receipt = `assets/images/receipts/dummy.jpg`

                }
                this.bookings = response.payload
                // console.log(this.isFree);

            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onPayment(item) {
        this.selectedItem = { ...item }
        this.paymentDialog = true
    }

    onPaymentSubmit() {
        console.log(this.selectedItem, this.amount);

        this.authService._Put('organizer/bookings/payment', this.selectedItem.payment._id, { eventId: this.id, amount: this.amount, status: 'Approved', isApproved: true }).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.ngOnInit();
                this.selectedItem = {}
                this.paymentDialog = false;
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onFreePayment(item) {
        this.selectedItem = { ...item }
        this.authService._Put('organizer/bookings/payment', this.selectedItem.payment._id, { eventId: this.id, amount: 0, status: 'Approved', isApproved: true }).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.ngOnInit();
                this.selectedItem = {}
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onApprove(item) {
        this.selectedItem = { ...item }
        this.authService._Put('organizer/bookings/payment', this.selectedItem.payment._id, { eventId: this.id, amount: this.selectedItem.amount, status: 'Approved', isApproved: true }).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.ngOnInit();
                this.selectedItem = {}
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onDisapprove(item) {
        this.selectedItem = { ...item }
        this.authService._Put('organizer/bookings/payment', this.selectedItem.payment._id, {  amount: 0, status: 'DisApproved', isApproved: false }).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.ngOnInit();
                this.selectedItem = {}
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }



}
