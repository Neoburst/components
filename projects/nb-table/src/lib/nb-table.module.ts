import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NbTableDirectivesModule } from './nb-table-directives/nb-table-directives.module';
import { NbTableComponent } from './nb-table.component';
import { NbTableService } from './nb-table.service';
import { NbTableComponentsModule } from './nb-table-components/nb-table-components.module';
import { NbIconComponent } from './nb-table-components/nb-icon/nb-icon.component';

@NgModule({
  declarations: [
    NbTableComponent,
  ],
  imports: [
    BrowserModule,
    NbTableDirectivesModule,
    NbIconComponent
  ],
  exports: [
    NbTableComponent,
    NbTableDirectivesModule,
    NbTableComponentsModule
  ],
  providers: [NbTableService]
})
export class NbTableModule { }
