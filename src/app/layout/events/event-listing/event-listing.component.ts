import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../app/shared/services/auth.service';
import { CommonService } from '../../../../app/shared/services/common.service';
import { UploadService } from '../../../../app/shared/services/upload.service';
import { ValidateService } from '../../../../app/shared/services/validate.service';
import { environment } from '../../../../environments/environment';
import { Event } from '../../models/Event';

class ImageSnippet {
    constructor(public src: string, public file: File) { }
}

@Component({
    selector: 'app-event-listing',
    templateUrl: './event-listing.component.html',
    styleUrls: ['./event-listing.component.scss']
})
export class EventListingComponent implements OnInit {

    user: any;
    role: string;
    events: Event[];
    event: Event;
    today: Date = new Date();
    selectedEvent: Event;
    sortOptions: SelectItem[];
    categories: any[] = [];
    durations: any[] = [];
    image: File;
    selectedImage: ImageSnippet;
    selectedFile: ImageSnippet;
    category: string;
    duration: string;
    sortOrder: number;
    sortField: string;
    eventDialog: boolean = false;
    eventEditDialog: boolean = false;
    accountDialog: boolean = false;
    paymentDialog: boolean = false;
    checked: boolean = true;
    booked: boolean = false;
    baseURL: string;
    account: any;
    @ViewChild('imageFile', { static: false }) imageFile: ElementRef;

    constructor(
        private authService: AuthService,
        private validateService: ValidateService,
        private uploadService: UploadService,
        private commonService: CommonService,
        private router: Router,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.commonService.getCategories().then(cats => { this.categories = cats });
        this.commonService.getDurations().then(item => { this.durations = item });
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.role = this.user.role;
        this.baseURL = environment.baseURL;
        console.log(this.today);


        if (this.role == 'viewer') {
            this.authService._GetAll('event/all').subscribe(response => {
                if (response.success == true) {
                    console.log(response.payload);
                    this.events = response.payload
                    for (let i = 0; i < this.events.length; i++) {
                        const e = this.events[i];
                        e.amount == 0 ? e.free = true : e.free = false
                        e.eventTime = tConvert(e.eventTime);
                    }
                }
                else { console.log(response); this.toastr.warning(response.message, 'Warning') }
            }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        }
        if (this.role == 'organizer') {
            this.authService._Get(this.user?._id, 'event/all').subscribe(response => {
                if (response.success == true) {
                    console.log(response.payload);
                    this.events = response.payload
                    for (let i = 0; i < this.events.length; i++) {
                        const e = this.events[i];
                        e.amount == 0 ? e.free = true : e.free = false
                        e.eventTime = tConvert(e.eventTime);
                        e.duration = e.duration.toString();
                    }
                }
                else { console.log(response); this.toastr.warning(response.message, 'Warning') }
            }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        }

        this.sortOptions = [
            { label: 'Price High to Low', value: '!amount' },
            { label: 'Price Low to High', value: 'amount' }
        ];
    }

    onBooked() {
        this.booked = true;
        this.authService._Get(this.user?._id, 'organizer/bookings/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.events = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onBookings(ev) {
        console.log(ev);
        this.router.navigate(['events/bookings', ev._id])
    }

    onAll() {
        this.booked = false;
        this.ngOnInit();
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

    onEdit(event) {
        this.selectedEvent = { ...event };
        this.selectedEvent.eventDate.slice(0, 11)
        console.log(this.selectedEvent);

        this.eventEditDialog = true
    }

    onClose(ev) {
        let event = { ...ev };
        this.authService._Put('event/close', event._id, {}).subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    onChange(event) {
        console.log(event);
        let file = event.target.files[0];
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

        if (!allowedExtensions.exec(file.name)) {
            this.toastr.warning('Please select Image.', 'Warning')
            this.imageFile.nativeElement.value = '';
            return false;
        }
        if (event.target.files[0].size > 1000000) return this.toastr.warning('Please select Image less than 1 MB.', 'Warning')
        // if (file.type != 'image/png' || file.type != 'image/jpg' || file.type != 'image/jpeg') return this.toastr.warning('Please select Image.', 'Warning')
        this.image = event.target.files[0];
        console.log(this.image.name);

        // const file: File = event.target.files[0];
        // const reader = new FileReader();
        // reader.addEventListener('load', (event: any) => {
        //     this.selectedFile = new ImageSnippet(event.target.result, file);
        //     this.uploadService._uploadFile('event/upload', this.selectedFile.file).subscribe(response => {
        //         if (response) {
        //             // console.log(response.payload);
        //             // this.events = response.payload
        //             this.eventDialog = false;
        //             this.event = {}
        //             this.ngOnInit();
        //         }
        //         else { console.log(response); this.toastr.warning('warning', 'Warning') }
        //     }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        // });
        // reader.readAsDataURL(file);
    }

    changeCategory(ev) { this.category = ev.value.label }
    changeDuration(ev) { this.duration = ev.value.label }

    onSubmit() {
        if (!this.validateService.validateName(this.event.name)) return this.toastr.warning('Event Name should be string', 'Validation Error')
        if (!this.validateService.validateName(this.event.hostName)) return this.toastr.warning('Host Name should be string', 'Validation Error')
        // if (!this.validateService.validateNumberOnly(this.duration)) return this.toastr.warning('Duration should be greater than 0', 'Validation Error')
        if (!this.checked) if (!this.validateService.validateNumberOnly(this.event.amount)) return this.toastr.warning('Amount should be greater than 0', 'Validation Error')
        if (!this.event.name || !this.event.hostName || !this.event.description ||
            !this.category || !this.event.eventDate || !this.event.eventTime || !this.duration)
            return this.toastr.warning('Please fill up the complete form', 'Validation Error')
        if (!this.image) return this.toastr.warning('Please attach event image', 'Validation Error')

        const formData = new FormData();
        formData.append('image', this.image, this.image.name);
        formData.append('userId', this.user._id);
        formData.append('hostName', this.event.hostName);
        formData.append('name', this.event.name);
        formData.append('description', this.event.description);
        formData.append('category', this.category);
        formData.append('eventDate', this.event.eventDate);
        formData.append('eventTime', this.event.eventTime);
        formData.append('duration', this.duration);
        if (this.event.amount) formData.append('amount', (this.event.amount).toString());

        if (this.event.amount) {
            this.confirmationService.confirm({
                message: 'After saving this event, It can not be cancel. You can only change its time later.',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.authService._Get(this.user._id, 'organizer/profile/complete').subscribe(response => {
                        if (response.success == true) {
                            this.postRequest(formData).subscribe(response => {
                                if (response.success == true) {
                                    this.eventDialog = false;
                                    this.event = {}
                                    this.ngOnInit();
                                }
                                else { console.log(response); this.toastr.warning(response.message, 'Warning') }
                            }, error => { console.log(error); this.toastr.error('error', 'Error') })
                        }
                        else { console.log(response); return this.toastr.warning(response.message, 'Warning'); }
                    }, error => { console.log(error); return this.toastr.error(error.error.message, 'Error'); })
                }
            });

        }
        else {
            this.confirmationService.confirm({
                message: 'After saving this event, It can not be cancel. You can only change its time later.',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.postRequest(formData).subscribe(response => {
                        if (response.success == true) {
                            this.eventDialog = false;
                            this.event = {}
                            this.ngOnInit();
                        }
                        else { console.log(response); this.toastr.warning(response.message, 'Warning') }
                    }, error => { console.log(error); this.toastr.error('error', 'Error') })
                }
            });


        }
    }

    onBook(item) {
        let event = { ...item }
        this.selectedEvent = event;
        console.log(event);

        this.authService._Get(event.userId, 'organizer/account').subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.account = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })

        const book = {
            userId: this.user._id,
            eventId: event._id,
            organizer: event.userId,
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to Book this event now?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.authService._Post('viewer/booking/add', book).subscribe(response => {
                    if (response.success == true) {
                        // console.log(response.payload);
                        this.ngOnInit();
                        this.toastr.success(response.message, 'Success')
                    }
                    else { console.log(response); this.toastr.warning(response.message, 'Warning') }
                }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
            }
        });

    }

    onStart(item) {
        let event = { ...item }

        console.log(event);
        if (event.isStarted == false) {
            this.confirmationService.confirm({
                message: 'Are you sure you want start event?',
                header: 'Confirm',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.authService._Put('event/start', event._id, {}).subscribe(response => {
                        if (response.success == true) {
                            // console.log(response.payload);
                            this.ngOnInit();
                            this.toastr.success(response.message, 'Success')
                        }
                        else { console.log(response); this.toastr.warning(response.message, 'Warning') }
                    }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
                }
            });
        } else {
            this.toastr.info('Joining Webinar...', 'Success')
            this.router.navigate(['webinar', event._id])
        }

        // this.authService._Get(event.userId, 'organizer/account').subscribe(response => {
        //     if (response.success == true) {
        //         // console.log(response.payload);
        //         this.account = response.payload
        //     }
        //     else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        // }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })


    }

    updateEvent() {
        if (!this.validateService.validateName(this.selectedEvent.name)) return this.toastr.warning('Event Name should be string', 'Validation Error')
        if (!this.validateService.validateName(this.selectedEvent.hostName)) return this.toastr.warning('Host Name should be string', 'Validation Error')
        if (!this.validateService.validateNumberOnly(this.selectedEvent.duration)) return this.toastr.warning('Duration should be greater than 0', 'Validation Error')
        if (!this.selectedEvent.free) if (!this.validateService.validateNumberOnly(this.selectedEvent.amount)) return this.toastr.warning('Amount should be greater than 0', 'Validation Error')
        if (!this.selectedEvent.name || !this.selectedEvent.hostName || !this.selectedEvent.description ||
            !this.selectedEvent.eventDate || !this.selectedEvent.eventTime || !this.selectedEvent.duration)
            return this.toastr.warning('Please fill up the complete form', 'Validation Error')

        const event = {
            hostName: this.selectedEvent.hostName,
            name: this.selectedEvent.name,
            description: this.selectedEvent.description,
            eventDate: this.selectedEvent.eventDate,
            eventTime: this.selectedEvent.eventTime,
            duration: this.selectedEvent.duration,
            amount: this.selectedEvent.amount,
        }
        console.log(event);

        this.authService._Put('event/edit', this.selectedEvent._id, event).subscribe(response => {
            if (response.success == true) {
                this.eventEditDialog = false;
                this.selectedEvent = {}
                this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    postRequest(formData): Observable<any> {
        return Observable.create(observer => {
            var xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.open('POST', `${this.baseURL}/event/add`, true);
            xhr.send(formData);
        });
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

