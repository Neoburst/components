import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbTableSortComponent } from './nb-table-sort/nb-table-sort.component';
import { NbIconComponent } from './nb-icon/nb-icon.component';

@NgModule({
  declarations: [
    NbTableSortComponent,
  ],
  imports: [
    CommonModule,
    NbIconComponent
  ],
  exports: [
    NbTableSortComponent
  ]
})
export class NbTableComponentsModule { }
