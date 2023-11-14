import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  control = new FormControl<string | undefined>('Initial value', Validators.required);
  errorControl = new FormControl<number | undefined>(3, Validators.min(10));

  form!: FormGroup<{ foo: FormControl<string | null | undefined>; }>;
  ngModelValue: string = 'NbInput by ngModel';

  constructor (private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.control.valueChanges.subscribe(value => {
      console.log('control value', value);
    });

    this.form = this._fb.group({
      foo: new FormControl<string | null | undefined>('Hello NbInput!')
    });
  }
}
