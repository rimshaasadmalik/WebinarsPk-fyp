import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { UploadService } from '../../../../app/shared/services/upload.service';
import { AuthService } from '../../../../app/shared/services/auth.service';
import { CommonService } from '../../../../app/shared/services/common.service';
import { Event } from '../../models/Event';

@Component({
    selector: 'app-booked',
    templateUrl: './booked.component.html',
    styleUrls: ['./booked.component.scss']
})
export class BookedComponent implements OnInit {

    user: any;
    events: any[];
    event: Event;
    sortOptions: SelectItem[];
    categories: any[] = [];
    image: File;
    category: string;
    sortOrder: number;
    sortField: string;
    payment: string;
    eventDialog: boolean = false;
    receiptDialog: boolean = false;
    @ViewChild('imageFile', { static: false }) imageFile: ElementRef;

    constructor(
        private authService: AuthService,
        private uploadService: UploadService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        // this.commonService.getCategories().then(cats => { this.categories = cats; console.log(cats); });
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.authService._Get(this.user?._id, 'viewer/bookings/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.events = response.payload
                for (let i = 0; i < this.events.length; i++) {
                    const e = this.events[i];
                    e.event.eventTime = tConvert(e?.event?.eventTime);
                    // e.amount == 0 ? e.free = true : e.free = false
                }
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        }
        else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onAdd() { this.event = {}; this.eventDialog = true }
    onReceipt(event) { this.payment = event.payment._id; this.receiptDialog = true; console.log(this.payment) }
    onChange(event) {
        this.image = null;
        let file = event.target.files[0];
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (event.target.files[0].size > 1000000) return this.toastr.warning('Please select Image less than 1 MB.', 'Warning')
        if (!allowedExtensions.exec(file.name)) {
            this.toastr.warning('Please select Image.', 'Warning')
            this.imageFile.nativeElement.value = '';
            return false;
        }
        this.image = event.target.files[0];
    }

    changeCategory(ev) { this.category = ev.value.label }

    onSubmit() {
        if (!this.image) return this.toastr.warning('Receipt not attached', 'Warning')
        const formData = new FormData();
        formData.append('image', this.image, this.image.name);
        formData.append('userId', this.user._id);
        formData.append('payment', this.payment);

        // if (this.event.amount) formData.append('amount', (this.event.amount).toString());

        this.uploadService._uploadImage(formData, 'viewer/upload/receipt').subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                // this.events = response.payload
                this.eventDialog = false;
                this.payment = ''
                // this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => {
            console.log(error);
            debugger;
            this.toastr.error('error', 'Error')
        })

        // this.authService._Post('event/add', event).subscribe(response => {
        //     if (response.success == true) {
        //         // console.log(response.payload);
        //         this.events = response.payload
        //         this.eventDialog = false;
        //         this.event = {}
        //         this.ngOnInit();
        //     }
        //     else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        // }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onJoin(event) {
        console.log(event);

        this.toastr.info('Joining Webinar...', 'Success')
        this.router.navigate(['webinar', event._id])
    }
}


function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

