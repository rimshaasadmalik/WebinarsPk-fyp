import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommonService } from '../../../app/shared/services/common.service';

@Component({
    selector: 'app-home-nav',
    templateUrl: './home-nav.component.html',
    styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {

    items: MenuItem[];
    categories: any[] = [];

    constructor(
        private commenService: CommonService
    ) { }

    ngOnInit() {
        this.commenService.getCategories().then(cats => {
            cats.forEach(e => {
                e.routerLink = "/home"
                e.queryParams = {cat:e.label}
            })
            // console.log(cats);

            this.items = [
                {
                    label: 'Explore',
                    icon: 'pi pi-fw pi-compass',
                    routerLink: ['/home/explore']
                },
                {
                    label: 'Artist',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/home/artists']
                },
                // {
                //     label: 'Category',
                //     icon: 'pi pi-fw pi-th-large',
                //     items: cats
                // },
                {
                    label: 'FAQ',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/home/faq']
                },
                {
                    label: 'Contact Us',
                    icon: 'pi pi-fw pi-comments',
                    routerLink: ['/home/contact-us']
                },
            ];
        });
        // console.log(this.categories);


    }

}
