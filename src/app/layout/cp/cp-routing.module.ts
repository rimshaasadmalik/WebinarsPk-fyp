import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';
import { AuthGuard } from '../../../app/shared';
import { EventsComponent } from './events/events.component';
import { FaqsComponent } from './faqs/faqs.component';
import { RequestsComponent } from './requests/requests.component';
import { UsersComponent } from './users/users.component';
import { ViewersComponent } from './viewers/viewers.component';

const routes: Routes = [
    { path: 'faqs', component: FaqsComponent, canActivate: [AuthGuard] },
    { path: 'requests', component: RequestsComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'artists', component: ArtistsComponent, canActivate: [AuthGuard] },
    { path: 'viewers', component: ViewersComponent, canActivate: [AuthGuard] },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CpRoutingModule { }
