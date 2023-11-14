import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCellDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbExpandableRowDirective,
  NbHeaderCellDirective,
  NbHeaderRowDirective,
  NbRowDirective,
  NbTableDirective,
  NbTableRowDirective,
} from './nb-table.directive';

@NgModule({
  declarations: [
    NbTableDirective,
    NbColumnHeaderDirective,
    NbColumnCellDirective,
    NbHeaderRowDirective,
    NbRowDirective,
    NbHeaderCellDirective,
    NbCellDirective,
    NbTableRowDirective,
    NbExpandableRowDirective
  ],
  imports: [CommonModule],
  exports: [
    NbTableDirective,
    NbColumnHeaderDirective,
    NbColumnCellDirective,
    NbHeaderRowDirective,
    NbRowDirective,
    NbHeaderCellDirective,
    NbCellDirective,
    NbTableRowDirective,
    NbExpandableRowDirective
  ],
})
export class NbTableDirectivesModule { }
