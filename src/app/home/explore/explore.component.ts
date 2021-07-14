import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { AuthService } from '../../../app/shared/services/auth.service';
import { CommonService } from '../../../app/shared/services/common.service';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {

    user: any;
    products: any[];
    sortOptions: SelectItem[];
    categories: any[] = []
    sortOrder: number;
    sortField: string;
    cat: string;

    constructor(
        private authService: AuthService,
        private commenService: CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.commenService.getCategories().then(cats => {
            this.categories = cats
            this.categories.push({ "id": 10, "label": "All" })
            console.log(this.categories);
        })

        this.authService._GetAll('event/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.products = response.payload
                for (let i = 0; i < this.products.length; i++) {
                    const e = this.products[i];
                    e.amount == 0 ? e.free = true : e.free = false
                }
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

    onChangeCategory(ev) {
        console.log(ev.value);
        if (ev.value.label === "All") { this.ngOnInit(); }
        else {
            this.authService._GetConds('viewer/events/bycategory', ev.value.label).subscribe(response => {
                if (response.success == true) {
                    console.log(response.payload);
                    this.products = response.payload
                }
                else { console.log(response); this.toastr.warning(response.message, 'Warning') }
            }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
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

    }

}
