import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../app/shared';
import { BookedComponent } from './booked/booked.component';
import { BookingsComponent } from './bookings/bookings.component';
import { EventListingComponent } from './event-listing/event-listing.component';

const routes: Routes = [
    { path: '', component: EventListingComponent, canActivate: [AuthGuard] },
    { path: 'booked', component: BookedComponent, canActivate: [AuthGuard] },
    { path: 'bookings/:id', component: BookingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventsRoutingModule { }
