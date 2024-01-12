import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbGridComponent } from './nb-grid.component';
import { NbGridService } from './nb-grid.service';
import { NbGridItem } from './directives/nb-grid-item.directive';
import { signal } from '@angular/core';

describe('NbGridDisplayComponent', () => {
  let component: NbGridComponent;
  let fixture: ComponentFixture<NbGridComponent>;
  const gridItemState = signal<{ [key: string]: NbGridItem; }>({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NbGridComponent],
      providers: [
        NbGridService
        // {
        //   provide: NbGridService, useValue: <Partial<NbGridService>>{
        //     gridItemState: gridItemState.asReadonly(),
        //     getItem: (itemId: string | undefined) => itemId ? gridItemState()[itemId] : undefined,
        //   }
        // }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NbGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a 'nb-grid' class`, () => {
    // arrange
    const element = fixture.nativeElement as HTMLElement;

    // assert
    expect(element.classList.contains('nb-grid')).toBeTruthy();
  });

  it(`should have a '--cols' css variable when columns are set`, () => {
    // arrange
    component.columns = 3;
    const element = fixture.nativeElement as HTMLElement;

    // act
    fixture.detectChanges();

    // assert
    expect(element.style.getPropertyValue('--cols')).toBeTruthy();
    expect(element.style.getPropertyValue('--cols')).toBe('3');
  });

  it(`should have a '--gap' css variable when gap is set`, () => {
    // arrange
    component.gap = 30;
    const element = fixture.nativeElement as HTMLElement;

    // act
    fixture.detectChanges();

    // assert
    expect(element.style.getPropertyValue('--gap')).toBeTruthy();
    expect(element.style.getPropertyValue('--gap')).toBe('30px');
  });

  it(`should have a '--min-item-width' css variable when minItemWidth is set`, () => {
    // arrange
    component.minItemWidth = 200;
    const element = fixture.nativeElement as HTMLElement;

    // act
    fixture.detectChanges();

    // assert
    expect(element.style.getPropertyValue('--min-item-width')).toBeTruthy();
    expect(element.style.getPropertyValue('--min-item-width')).toBe('200px');
  });

  it(`should have an 'active-resizers' class when displayResizers is true`, () => {
    // arrange
    component.displayResizers = true;
    const element = fixture.nativeElement as HTMLElement;

    // act
    fixture.detectChanges();

    // assert
    expect(element.classList.contains('active-resizers')).toBeTruthy();
  });

  it(`should not have an 'active-resizers' class when displayResizers is false`, () => {
    // arrange
    component.displayResizers = false;
    const element = fixture.nativeElement as HTMLElement;

    // act
    fixture.detectChanges();

    // assert
    expect(element.classList.contains('active-resizers')).toBeFalsy();
  });
});
