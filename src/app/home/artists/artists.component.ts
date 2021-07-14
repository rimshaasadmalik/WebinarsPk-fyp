import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Event } from '../../../app/layout/models/Event';
import { AuthService } from '../../../app/shared/services/auth.service';

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

    rows: any[];

    constructor(
        // private nav: HomeNavComponent,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.authService._GetAll('viewer/organizers/all').subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.rows = response.payload
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })

    }

}
