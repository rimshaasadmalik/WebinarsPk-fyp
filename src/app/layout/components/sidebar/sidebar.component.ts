import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    menuItems: any;
    user: any;
    notifications: any[] = [];
    notificationIds: number[] = [];
    position: string = 'top-right';
    previousCount: number;
    currentCount: number;
    unseenCount: number;
    userId: number;
    subscription: Subscription;
    notificationDialog: boolean = false;

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(
        // private translate: TranslateService,
        private authService: AuthService,
        private toastr: ToastrService,
        private changeDetection: ChangeDetectorRef,
        public router: Router
    ) {
        this.previousCount = 0;
        this.unseenCount = 0;

        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });

        let user = JSON.parse(window.localStorage.getItem('user'))
        this.menuItems = user.role?.permissions?.canRead
        // console.log(this.menuItems);

    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.user = JSON.parse(window.localStorage.getItem('user'))
        // console.log('-->',this.user);
        // this.oneTimeGetNotifications();
        // this.getNotifications(true)
        const source = interval(10000);
        // this.subscription = source.subscribe(noti => this.getNotifications(false));


    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        this.getNotifications(true)
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

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

    changeLang(language: string) {
        // this.translate.use(language);
    }

    viewNotifications() {
        this.notificationDialog = true
    }

    onLoggedout() {
        // localStorage.removeItem('isLoggedin');
        this.authService.logout();
        this.router.navigate(['login'])
    }



    getNotifications(check: boolean) {
        // console.log('1');

        this.authService._Get(this.user.supId, 'supplier/notifications').subscribe(
            response => {
                if (response.success == true) {
                    // console.log(response.payload)
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

    }

    ngOnDestroy() { this.subscription && this.subscription.unsubscribe() }
}


// oneTimeGetNotifications() {
//     this.requestsService.getRequest(AppConstants.GET_USER_NOTIFICATION_PERMISSION + this.userId)
//         .subscribe(
//             (response: Response) => {
//                 //debugger;
//                 if (response['responseCode'] === 'GET_USER_NOTIFICATION_PERMISSION_SUCCESS') {
//                     this.userPermissions = JSON.parse(response['responseData']);
//                     //console.log(this.userPermissions);
//                 }
//             },
//             (error: any) => {
//             }
//         );
//     this.requestsService.getRequest(AppConstants.FETCH_ALL_NOTIFICATIONS)
//         .subscribe(
//             (response: Response) => {
//                 //debugger;
//                 if (response['responseCode'] === 'ALL_NOTIFICATIONS_SUCCESS_01') {
//                     this.notifications = JSON.parse(response['responseData']);
//                     this.previousCount = this.currentCount = this.checkLength(this.notifications);
//                     //console.log(this.notifications);
//                     for (let noti of this.notifications) {
//                         if (noti.active == true) {
//                             this.unseenCount++;
//                             //this.notificationIds.push(noti.notificationId);
//                         }
//                     }
//                     //this.count.emit(this.unseenCount);
//                     this.changeDetection.markForCheck();
//                 }
//             },
//             (error: any) => {
//                 this.changeDetection.markForCheck();
//             }
//         );
// }
