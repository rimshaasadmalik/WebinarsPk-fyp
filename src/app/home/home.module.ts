import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CaptchaModule } from 'primeng/captcha';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { EventsRoutingModule } from '../layout/events/events-routing.module';
import { ArtistsComponent } from './artists/artists.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FaqComponent } from './faq/faq.component';
import { HomeNavComponent } from './home-nav/home-nav.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExploreComponent } from './explore/explore.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
    declarations: [HomeComponent, HomeNavComponent, ArtistsComponent, ContactusComponent, FaqComponent, ExploreComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MenubarModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        InputTextareaModule,
        AccordionModule,
        ButtonModule,
        EventsRoutingModule,
        DataViewModule,
        PanelModule,
        DialogModule,
        DropdownModule,
        RippleModule,
        RatingModule,
        FormsModule,
        CaptchaModule
    ]
})
export class HomeModule { }
