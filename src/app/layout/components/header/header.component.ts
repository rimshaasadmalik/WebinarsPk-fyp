import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    public pushRightClass: string;
    notificationDialog: boolean = false;
    cartDialog: boolean = false;
    position: string = 'top-right';
    user: any;
    event: any;
    notifications: any[] = [];
    notificationIds: number[] = [];
    previousCount: number;
    currentCount: number;
    unseenCount: number;
    userId: number;
    subscription: Subscription;

    constructor(
        private changeDetection: ChangeDetectorRef,
        // private translate: TranslateService,
        private authService: AuthService,
        private toastr: ToastrService,
        public router: Router,
    ) {
        this.previousCount = 0;
        this.unseenCount = 0;
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.event = JSON.parse(window.localStorage.getItem('event'))
        this.getNotifications(true);
        // const source = interval(10000);
        // if (this.user.role.roleName == 'Admin') {
        //     // this.getNotifications(true, 'Admin')
        //     // this.subscription = source.subscribe(noti => this.getNotifications(false, 'Admin'));
        // }
        // else this.getNotifications(true, 'Supplier')

    }

    ngOnDestroy() { this.subscription && this.subscription.unsubscribe() }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        // localStorage.removeItem('isLoggedin');
        this.authService.logout();
        this.router.navigate(['login'])
    }

    changeLang(language: string) {
        // this.translate.use(language);
    }

    // check: boolean, type: string
    getNotifications(check: boolean) {

        this.authService._Get(this.user._id, 'viewer/notifications/all').subscribe(
            response => {
                if (response.success == true) {
                    console.log(response.payload)
                    this.notifications = response.payload
                    this.currentCount = this.notifications.length
                    if (this.currentCount > this.previousCount) {
                        this.unseenCount = this.currentCount - this.previousCount;
                        this.previousCount = this.currentCount;
                        for (let i = 0; i < this.unseenCount; i++) {
                            let noti = this.notifications[this.currentCount - (i + 1)];
                            if (check == false) this.toastr.info('New Notifications', 'Notification')
                        }
                    }
                    this.changeDetection.markForCheck();
                }
                else {
                    console.log(response)
                    this.toastr.warning(response.message, 'Error')
                }
            },
            error => {
                console.log(error);

                this.toastr.warning(error.error.message, 'Error')
            })

        // console.log('2');
        // if (type === 'Admin') {
        //     this.authService._GetConds('admin/notifications', 'admin').subscribe(
        //         response => {
        //             if (response.success == true) {
        //                 // console.log(response.payload)
        //                 this.notifications = response.payload
        //                 this.currentCount = this.notifications.length
        //                 if (this.currentCount > this.previousCount) {
        //                     this.unseenCount = this.currentCount - this.previousCount;
        //                     this.previousCount = this.currentCount;
        //                     for (let i = 0; i < this.unseenCount; i++) {
        //                         let noti = this.notifications[this.currentCount - (i + 1)];
        //                         if (check == false) this.toastr.info('New Notifications', 'Notification')
        //                     }
        //                 }
        //                 this.changeDetection.markForCheck();
        //             }
        //             else {
        //                 console.log(response)
        //                 this.toastr.warning(response.message, 'Error')
        //             }
        //         },
        //         error => {
        //             console.log(error);

        //             this.toastr.warning(error.error.message, 'Error')
        //         })
        // }
        // else {
        //     this.authService._Get(this.user.supId, 'supplier/notifications').subscribe(
        //         response => {
        //             if (response.success == true) {
        //                 // console.log(response.payload)
        //                 this.notifications = response.payload
        //                 this.currentCount = this.notifications.length
        //                 if (this.currentCount > this.previousCount) {
        //                     this.unseenCount = this.currentCount - this.previousCount;
        //                     this.previousCount = this.currentCount;
        //                     for (let i = 0; i < this.unseenCount; i++) {
        //                         let noti = this.notifications[this.currentCount - (i + 1)];
        //                         if (check == false) this.toastr.info('New Notifications', 'Notification')
        //                     }
        //                 }
        //                 this.changeDetection.markForCheck();
        //             }
        //             else {
        //                 console.log(response)
        //                 this.toastr.warning(response.message, 'Error')
        //             }
        //         },
        //         error => {
        //             console.log(error);

        //             this.toastr.warning(error.error.message, 'Error')
        //         })
        // }
    }

    viewNotifications() {
        // console.log('Hi');
        this.notificationDialog = true
    }

    openCart() { this.cartDialog = true }

    onBookNow(event) {
        let ev = { ...event }
        const book = {
            userId: this.user._id,
            eventId: ev._id,
            organizer: ev.userId,
        }
        console.log(book);
        this.authService._Post('viewer/booking/add', book).subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                window.localStorage.removeItem('event');
                this.cartDialog = false;
                this.ngOnInit();
                this.toastr.success(response.message, 'Success')
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }
}
