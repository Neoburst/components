import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbGridComponent } from './nb-grid.component';

describe('NbGridDisplayComponent', () => {
  let component: NbGridComponent;
  let fixture: ComponentFixture<NbGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NbGridComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NbGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
