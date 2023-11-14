import { AfterViewInit, Component, ContentChild, ElementRef, Injector, effect, forwardRef } from '@angular/core';
import { NbInputDirective } from 'projects/nb-input/src/lib/nb-input.directive';

@Component({
  standalone: true,
  selector: 'nb-form-field',
  templateUrl: './nb-form-field.component.html',
  styleUrls: ['./nb-form-field.component.scss']
})
export class NbFormFieldComponent implements AfterViewInit {
  @ContentChild(forwardRef(() => NbInputDirective)) nbInput?: NbInputDirective;

  private get _formField(): HTMLElement {
    return this._element.nativeElement;
  }

  constructor (private _element: ElementRef<HTMLElement>, private _injector: Injector) {
    this._formField.classList.add('nb-form-field');
  }

  ngAfterViewInit(): void {
    if (this.nbInput) {
      effect(() => {
        const inputValue = this.nbInput!.value();
        this._formField.classList.toggle('has-value', !!inputValue);
      }, { injector: this._injector });

      effect(() => {
        const invalid = this.nbInput!.invalid();
        this._formField.classList.toggle('nb-invalid', !!invalid);
      }, { injector: this._injector });
    }
  }
}
