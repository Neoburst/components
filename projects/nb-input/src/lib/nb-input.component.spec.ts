import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbInputComponent } from './nb-input.component';

describe('NbInputComponent', () => {
  let component: NbInputComponent;
  let fixture: ComponentFixture<NbInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NbInputComponent]
    });
    fixture = TestBed.createComponent(NbInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
