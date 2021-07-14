import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { BookedComponent } from './booked/booked.component';
import { BookingsComponent } from './bookings/bookings.component';
import { EventListingComponent } from './event-listing/event-listing.component';
import { EventsRoutingModule } from './events-routing.module';


@NgModule({
    declarations: [EventListingComponent, BookedComponent, BookingsComponent],
    imports: [
        CommonModule,
        // BrowserAnimationsModule,
        EventsRoutingModule,
        FileUploadModule,
        DataViewModule,
        ConfirmDialogModule,
        ToggleButtonModule,
        PanelModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        RatingModule,
        FormsModule,
        TableModule,
        TooltipModule
    ],
    providers: [ConfirmationService]
})
export class EventsModule { }
