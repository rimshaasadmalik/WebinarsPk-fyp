import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
    imports: [CommonModule, LayoutRoutingModule, ButtonModule, DialogModule, NgbDropdownModule],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent, NotificationsComponent]
})
export class LayoutModule { }
