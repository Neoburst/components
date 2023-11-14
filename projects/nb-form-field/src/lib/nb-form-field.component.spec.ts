import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbFormFieldComponent } from './nb-form-field.component';

describe('NbFormFieldComponent', () => {
  let component: NbFormFieldComponent;
  let fixture: ComponentFixture<NbFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NbFormFieldComponent]
    });
    fixture = TestBed.createComponent(NbFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
