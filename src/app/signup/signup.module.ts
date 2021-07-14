import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';


@NgModule({
    imports: [CommonModule, FormsModule, SignupRoutingModule, MultiSelectModule, InputMaskModule],
    declarations: [SignupComponent]
})
export class SignupModule { }
