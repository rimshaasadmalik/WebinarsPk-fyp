import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
            { path: 'cp', loadChildren: () => import('./cp/cp.module').then((m) => m.CpModule) },
            { path: 'organizer', loadChildren: () => import('./organizer/organizer.module').then((m) => m.OrganizerModule) },
            { path: 'viewer', loadChildren: () => import('./viewer/viewer.module').then((m) => m.ViewerModule) },
            { path: 'events', loadChildren: () => import('./events/events.module').then((m) => m.EventsModule) },
            { path: 'webinar/:id', loadChildren: () => import('./webinar/webinar.module').then((m) => m.WebinarModule) },
            { path: 'payments', loadChildren: () => import('./payments/payments.module').then((m) => m.PaymentsModule) },
            { path: 'reports', loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then((m) => m.BlankPageModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
