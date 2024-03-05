import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NbTableComponent } from './nb-table.component';
import { NbTableComponentsModule } from './nb-table-components/nb-table-components.module';
import {
  NbCellDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbExpandableRowDirective,
  NbHeaderCellDirective,
  NbHeaderRowDirective,
  NbRowDirective,
  NbTableDirectiveImpl,
  NbTableRowDirective
} from './nb-table-directives/nb-table.directive';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    NbTableComponent,
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
  exports: [
    NbTableComponent,
    NbTableComponentsModule,
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
export class NbTableModule { }
