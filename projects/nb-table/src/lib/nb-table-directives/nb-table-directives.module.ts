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
  NbTableDirectiveImpl,
  NbTableRowDirective,
} from './nb-table.directive';

@NgModule({
  declarations: [
    NbTableDirectiveImpl,
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
    NbTableDirectiveImpl,
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
