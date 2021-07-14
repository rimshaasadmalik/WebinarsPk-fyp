import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebinarRoutingModule } from './webinar-routing.module';
import { WebinarComponent } from './webinar.component';


@NgModule({
  declarations: [WebinarComponent],
  imports: [
    CommonModule,
    WebinarRoutingModule
  ]
})
export class WebinarModule { }
