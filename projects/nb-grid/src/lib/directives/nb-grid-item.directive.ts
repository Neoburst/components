import { Directive, ElementRef, Input, OnInit, Renderer2, signal } from '@angular/core';
import { NbGridService } from '../nb-grid.service';

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
export class NbGridItemDirective implements OnInit {
  @Input('nbGridItem') set gridItem(gridItem: NbGridItem | undefined) {
    if (!gridItem) return;

    this._gridItem.set(gridItem);
    this.gridElement.style.gridColumnStart = `span ${gridItem.cols}`;
    this.gridElement.style.gridRowStart = `span ${gridItem.rows}`;

    this._itemId = this._nbGridService.registerItem(this.gridElement, gridItem);
  };

  @Input('nbGridItemDrag') set draggable(draggable: boolean) {
    this.gridElement.draggable = draggable;
  }

  private _itemId: string | undefined;
  private _gridItem = signal<NbGridItem>({ cols: 1, rows: 1 });

  get gridElement(): HTMLElement {
    return this._element.nativeElement;
  }

  constructor (private _element: ElementRef<HTMLElement>, private _nbGridService: NbGridService, private _renderer: Renderer2) {
    this.gridElement.classList.add('nb-grid-item');
    RESIZER_CLASSES.forEach((resizerClass) => this._addResizer(resizerClass));
  }

  ngOnInit(): void {
    if (!this._itemId) this._itemId = this._nbGridService.registerItem(this.gridElement, this._gridItem());
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

      resizerClass === 'right' ? this._addHorizontalMouseListener(startX, startWidth, this._gridItem().cols) : this._addVerticalMouseListener(startY, startHeight, this._gridItem().rows);
    });

    this.gridElement.appendChild(resizer);
  }

  private _addHorizontalMouseListener(startX: number, startWidth: number, startCols: number): void {
    const mouseMove = this._renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      const newSpan = Math.round((startCols / startWidth) * (e.pageX - startX + startWidth));

      this._gridItem.update((gridItem) => ({ ...gridItem, cols: newSpan }));
      this.gridElement.style.gridColumnStart = `span ${newSpan}`;
    });

    this._setMouseUpListener(mouseMove);
  }

  private _addVerticalMouseListener(startY: number, startHeight: number, startRows: number): void {
    const mouseMove = this._renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      const newSpan = Math.round((startRows / startHeight) * (e.pageY - startY + startHeight));

      this._gridItem.update((gridItem) => ({ ...gridItem, rows: newSpan }));
      this.gridElement.style.gridRowStart = `span ${newSpan}`;
    });

    this._setMouseUpListener(mouseMove);
  }

  private _setMouseUpListener(mouseMove: () => void): void {
    const mouseUp = this._renderer.listen('document', 'mouseup', () => {
      mouseMove();
      mouseUp();

      if (this._itemId) this._nbGridService.updateItem(this._itemId, this._gridItem());
    });
  }
}
