import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { AuthService } from '../shared/services/auth.service';
import { HomeNavComponent } from './home-nav/home-nav.component';

@Component({
    providers: [HomeNavComponent],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


    user: any;
    products: Event[];
    sortOptions: SelectItem[];
    sortOrder: number;
    sortField: string;
    cat: string;

    constructor(
        private nav: HomeNavComponent,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        // this.nav.ngOnInit();
        this.cat = this.route.snapshot.queryParamMap.get('cat')
        console.log(this.cat);

        this.authService._GetAll('event/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.products = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })

        this.sortOptions = [
            { label: 'Price High to Low', value: '!amount' },
            { label: 'Price Low to High', value: 'amount' }
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

    onBook(item) {
        let event = { ...item }
        console.log(event);
        window.localStorage.setItem('event', JSON.stringify(event))
        if (!window.localStorage.getItem('user')) {
            this.toastr.info('Please Login to Complete Booking.')
            this.router.navigate(['/login'])
        }
        // else this.router.navigate(['/login'])

    }

}
