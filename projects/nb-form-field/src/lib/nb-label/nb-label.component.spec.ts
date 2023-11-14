import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbLabelComponent } from './nb-label.component';

describe('NbLabelComponent', () => {
  let component: NbLabelComponent;
  let fixture: ComponentFixture<NbLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NbLabelComponent]
    });
    fixture = TestBed.createComponent(NbLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
