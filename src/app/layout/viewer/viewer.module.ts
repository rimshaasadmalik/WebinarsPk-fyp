import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProfileComponent } from './profile/profile.component';
import { ViewerRoutingModule } from './viewer-routing.module';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ViewerRoutingModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    DialogModule
  ]
})
export class ViewerModule { }
