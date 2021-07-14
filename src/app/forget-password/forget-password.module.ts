import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './forget-password.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [ForgetPasswordComponent],
    imports: [
        CommonModule,
        ForgetPasswordRoutingModule,
        FormsModule
    ]
})
export class ForgetPasswordModule { }
