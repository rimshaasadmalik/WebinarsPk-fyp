import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../app/shared';
import { PayablesComponent } from './payables/payables.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReceivableComponent } from './receivable/receivable.component';

const routes: Routes = [
    { path: '', component: PaymentsComponent, canActivate: [AuthGuard] },
    { path: 'payables', component: PayablesComponent },
    { path: 'receivables', component: ReceivableComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentsRoutingModule { }
