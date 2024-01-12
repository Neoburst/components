import { TestBed } from '@angular/core/testing';
import { NbGridItemDirective } from './nb-grid-item.directive';
import { NbGridService } from '../nb-grid.service';
import { ElementRef, Renderer2 } from '@angular/core';

describe('NbGridItemDirective', () => {
  let directive: NbGridItemDirective;
  const listenSpy = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NbGridService,
        {
          provide: Renderer2, useValue: <Partial<Renderer2>>{
            listen: listenSpy
          }
        }
      ]
    });

    const elRef = new ElementRef<HTMLElement>(document.createElement('div'));
    const nbGridService = TestBed.inject(NbGridService);
    const renderer = TestBed.inject(Renderer2);
    directive = new NbGridItemDirective(elRef, nbGridService, renderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set gridItem', () => {
    // arrange
    const gridItem = { cols: 2, rows: 2 };

    // act
    directive.gridItem = gridItem;

    // assert
    expect(directive.gridElement.style.gridColumnStart).toBe(`span ${gridItem.cols}`);
    expect(directive.gridElement.style.gridRowStart).toBe(`span ${gridItem.rows}`);
  });

  it('should set draggable', () => {
    // arrange
    const draggable = true;

    // act
    directive.draggable = draggable;

    // assert
    expect(directive.gridElement.draggable).toBe(draggable);
  });

  it('should add resizer on creation', () => {
    // arrange
    const resizerClasses = ['right', 'bottom'];

    // act
    directive.ngOnInit();

    // assert
    resizerClasses.forEach((resizerClass) => {
      expect(directive.gridElement.querySelector(`.nb-grid-item-resizer-${resizerClass}`)).toBeTruthy();
    });
  });

  it('should add horizontal mouse listener', () => {
    // arrange
    const startX = 0;
    const startWidth = 100;
    const cols = 1;
    const event = { pageX: 50, preventDefault: jest.fn() } as MouseEventInit;

    // act
    directive['_addHorizontalMouseListener'](startX, startWidth, cols);
    directive.gridElement.querySelector('.nb-grid-item-resizer-right')?.dispatchEvent(new MouseEvent('mousedown', event));

    // assert
    expect(listenSpy).toHaveBeenCalledWith('document', 'mousemove', expect.any(Function));
    expect(listenSpy).toHaveBeenCalledWith('document', 'mouseup', expect.any(Function));
  });
});