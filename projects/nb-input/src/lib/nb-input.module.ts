import { NgModule } from '@angular/core';
import { NbInputComponent } from './nb-input.component';
import { NbInputDirective } from './nb-input.directive';
import { NbFormFieldModule } from 'projects/nb-form-field/src/public-api';

@NgModule({
  declarations: [
    NbInputComponent,
    NbInputDirective,
  ],
  imports: [
    NbFormFieldModule
  ],
  exports: [
    NbFormFieldModule,
    NbInputComponent,
    NbInputDirective
  ]
})
export class NbInputModule { }
