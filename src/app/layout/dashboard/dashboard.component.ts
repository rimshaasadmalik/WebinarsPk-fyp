import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    events: number = 0;
    payments: number = 0;
    bookings: number = 0;
    artists: number = 0;
    viewers: number = 0;
    requests: number = 0;
    user: any;
    role: string;

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.role = this.user?.role
        // console.log(this.role);
        if (this.role === 'admin') {
            console.log('admin');

            this.authService._Get(this.user._id, 'admin/dashboard').subscribe(response => {
                if (response.success == true) {
                    // console.log(response.payload);
                    this.events = parseInt(response.payload?.events)
                    this.artists = parseInt(response.payload?.artists)
                    this.viewers = parseInt(response.payload?.viewers)
                    this.requests = parseInt(response.payload?.requests)
                }
                else console.log(response)
            }, error => { console.log(error) })
        }
        if (this.role === 'organizer') {
            console.log('organizer');

            this.authService._Get(this.user._id, 'organizer/dashboard').subscribe(response => {
                if (response.success == true) {
                    // console.log(response.payload);
                    this.events = parseInt(response.payload?.events)
                    for (let i = 0; i < response.payload?.payments.length; i++) {
                        const e = response.payload?.payments[i];
                        this.payments += parseInt(e?.payment?.amount)
                    }
                }
                else console.log(response)
            }, error => { console.log(error) })
        }
        else {
            console.log('viewer');
            this.authService._Get(this.user._id, 'viewer/dashboard').subscribe(response => {
                if (response.success == true) {
                    console.log(response.payload);
                    this.events = response.payload?.events
                    this.bookings = response.payload?.bookings
                }
                else console.log(response)

            }, error => { console.log(error) })

        }
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
