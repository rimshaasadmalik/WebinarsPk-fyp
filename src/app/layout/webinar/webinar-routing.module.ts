import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../app/shared';
import { WebinarComponent } from './webinar.component';

const routes: Routes = [
    { path: '', component: WebinarComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebinarRoutingModule { }
