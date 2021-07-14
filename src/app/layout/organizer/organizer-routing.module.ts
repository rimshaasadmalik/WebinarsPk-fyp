import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../app/shared';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent }
    // { path: 'artists', component: OrganizerListingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizerRoutingModule { }
