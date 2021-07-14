import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SumPipe } from './sum';

@NgModule({
    imports: [CommonModule],
    declarations: [SumPipe],
    exports: [SumPipe]
})
export class SharedPipesModule { }
