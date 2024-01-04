import { Directive, ElementRef, Input, Renderer2, signal } from '@angular/core';

export interface NbGridItem {
  cols: number;
  rows: number;
}

const GRID_ITEM_RESIZER_CLASS = 'nb-grid-item-resizer';
const RESIZER_CLASSES = ['right', 'bottom'];

@Directive({
  selector: '[nbGridItem]',
  standalone: true
})
export class NbGridItemDirective {
  @Input('nbGridItem') set gridItem(gridItem: NbGridItem | undefined) {
    if (!gridItem) return;
    this._cols.set(gridItem.cols);
    this._rows.set(gridItem.rows);
    this.gridElement.style.gridColumnStart = `span ${gridItem.cols}`;
    this.gridElement.style.gridRowStart = `span ${gridItem.rows}`;
  };

  private _cols = signal(1);
  private _rows = signal(1);

  get gridElement(): HTMLElement {
    return this._element.nativeElement;
  }

  constructor (private _element: ElementRef, private _renderer: Renderer2) {
    this._element.nativeElement.classList.add('nb-grid-item');
    RESIZER_CLASSES.forEach((resizerClass) => this._addResizer(resizerClass));
  }

  private _addResizer(resizerClass: string): void {
    const resizer = document.createElement('div');
    resizer.classList.add(GRID_ITEM_RESIZER_CLASS, `${GRID_ITEM_RESIZER_CLASS}-${resizerClass}`);
    resizer.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const startX = event.pageX;
      const startY = event.pageY;
      const startWidth = (<HTMLElement>event.target).parentElement?.clientWidth || this.gridElement.clientWidth;
      const startHeight = (<HTMLElement>event.target).parentElement?.clientHeight || this.gridElement.clientHeight;

      resizerClass === 'right' ? this._addHorizontalMouseListener(startX, startWidth, this._cols()) : this._addVerticalMouseListener(startY, startHeight, this._rows());
    });

    this.gridElement.appendChild(resizer);
  }

  private _addHorizontalMouseListener(startX: number, startWidth: number, startCols: number): void {
    const mouseMove = this._renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      const newSpan = Math.round((startCols / startWidth) * (e.pageX - startX + startWidth));
      this._cols.set(newSpan);
      this.gridElement.style.gridColumnStart = `span ${newSpan}`;
    });

    const mouseUp = this._renderer.listen('document', 'mouseup', () => {
      mouseMove();
      mouseUp();
    });
  }

  private _addVerticalMouseListener(startY: number, startHeight: number, startRows: number): void {
    const mouseMove = this._renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      const newSpan = Math.round((startRows / startHeight) * (e.pageY - startY + startHeight));
      this._rows.set(newSpan);
      this.gridElement.style.gridRowStart = `span ${newSpan}`;
    });

    const mouseUp = this._renderer.listen('document', 'mouseup', () => {
      mouseMove();
      mouseUp();
    });
  }
}
