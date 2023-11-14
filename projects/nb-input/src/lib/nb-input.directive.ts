import { Directive, ElementRef, Injector, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { BehaviorSubject, map, startWith } from 'rxjs';

type NbInputEvent = (event: InputEvent) => void;

const NOOP = (_: any) => { };

@Directive({
  selector: '[nbInput]'
})
export class NbInputDirective implements OnInit, ControlValueAccessor {
  get input(): HTMLInputElement {
    return this._element.nativeElement;
  }

  invalid!: Signal<boolean | undefined>;
  value!: Signal<any>;

  onChange = NOOP;
  onTouched = NOOP;

  constructor (private _element: ElementRef<HTMLInputElement>, private _injector: Injector) { }

  ngOnInit(): void {
    if (this.input.parentElement?.localName !== 'nb-form-field') console.warn('NbInput should be placed inside an NbFormField element.');

    this._initControl();
    this._setClasses();
  }

  writeValue(value: any): void {
    this.input.value = value;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.input.disabled = isDisabled;
  }

  private _initControl(): void {
    const ngControl = this._injector.get(NgControl, null);

    this._setRequired(ngControl?.control);
    this._setValueAndValidityListener(ngControl?.control);
  }

  private _setRequired(control: AbstractControl | null | undefined): void {
    if (!control || !control.validator) return;

    const { validator } = control;
    const validation = validator(<AbstractControl>{});
    this.input.required = !!validation?.required;
  }

  private _setValueAndValidityListener(control: AbstractControl | null | undefined): void {
    if (control) {
      this.invalid = toSignal(control.statusChanges.pipe(startWith(control.status), map((status) => status === 'INVALID')), { injector: this._injector });
      this.value = toSignal(control.valueChanges.pipe(startWith(control.value)), { injector: this._injector });
    }
    else {
      const inputB$ = new BehaviorSubject(this.input.value);
      const invalidB$ = new BehaviorSubject<boolean>(!this.input.validity.valid);

      (<NbInputEvent>this._element.nativeElement.oninput) = (event: InputEvent) => {
        inputB$.next((<HTMLInputElement>event.target)?.value);
        invalidB$.next(!(<HTMLInputElement>event.target)?.validity.valid);
      };

      this.invalid = toSignal(invalidB$, { injector: this._injector });
      this.value = toSignal(inputB$, { injector: this._injector });
    }
  }

  private _setClasses(): void {
    this.input.classList.add('nb-input');
  }
}
