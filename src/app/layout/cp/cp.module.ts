import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpRoutingModule } from './cp-routing.module';
import { FaqsComponent } from './faqs/faqs.component';
import { RequestsComponent } from './requests/requests.component';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { UsersComponent } from './users/users.component';
import { EventsComponent } from './events/events.component';
import { ArtistsComponent } from './artists/artists.component';
import { ViewersComponent } from './viewers/viewers.component';


@NgModule({
    declarations: [FaqsComponent, RequestsComponent, UsersComponent, EventsComponent, ArtistsComponent, ViewersComponent],
    imports: [
        CommonModule,
        CpRoutingModule,
        DataViewModule,
        ConfirmDialogModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
        ButtonModule,
        RippleModule,
        FormsModule,
        TableModule,
    ],
    providers: [ConfirmationService]
})
export class CpModule { }
