import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SharedPipesModule } from '../../../app/shared';
import { PayablesComponent } from './payables/payables.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments/payments.component';
import { ReceivableComponent } from './receivable/receivable.component';



@NgModule({
    declarations: [PaymentsComponent, PayablesComponent, ReceivableComponent],
    imports: [
        CommonModule,
        PaymentsRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        ContextMenuModule,
        SharedPipesModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        ProgressBarModule,
        SliderModule,
        ToastModule,
        TooltipModule,
        ChartModule,
        CardModule,
        CalendarModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class PaymentsModule { }
