import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OrganizerListingComponent } from './organizer-listing/organizer-listing.component';
import { OrganizerRoutingModule } from './organizer-routing.module';
import { PaymentsComponent } from './payments/payments.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [PaymentsComponent, OrganizerListingComponent, ProfileComponent],
  imports: [
    CommonModule,
    OrganizerRoutingModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    DialogModule
  ]
})
export class OrganizerModule { }
