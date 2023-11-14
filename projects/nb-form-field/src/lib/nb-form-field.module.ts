import { NgModule } from '@angular/core';
import { NbFormFieldComponent } from './nb-form-field.component';
import { NbLabelComponent } from './nb-label/nb-label.component';
import { FloatLabelDirective } from './nb-label/float-label.directive';

@NgModule({
  declarations: [],
  imports: [
    FloatLabelDirective,
    NbFormFieldComponent,
    NbLabelComponent
  ],
  exports: [
    FloatLabelDirective,
    NbFormFieldComponent,
    NbLabelComponent
  ]
})
export class NbFormFieldModule { }
