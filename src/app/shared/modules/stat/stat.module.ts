import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatComponent } from './stat.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [StatComponent],
    exports: [StatComponent]
})
export class StatModule {}
