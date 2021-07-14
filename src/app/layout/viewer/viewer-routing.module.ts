import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../app/shared';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerRoutingModule { }
