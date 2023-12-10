/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import {
  AfterViewChecked,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  effect,
} from '@angular/core';
import { NbTableService } from '../nb-table.service';

export interface INbTableDirective {
  template: TemplateRef<any>;
}

@Directive({
  selector: '[nbTable]',
})
export class NbTableDirective implements INbTableDirective {
  constructor (public template: TemplateRef<any>) { }
}

@Directive({
  selector: '[nbColumnHeader]',
  providers: [
    { provide: NbTableDirective, useExisting: NbColumnHeaderDirective },
  ],
})
export class NbColumnHeaderDirective implements INbTableDirective {
  /**
   * The column header to display.
   */
  @Input({ alias: 'nbColumnHeader', required: true }) column!: string;

  constructor (
    public template: TemplateRef<any>,
  ) { }
}

@Directive({
  selector: '[nbColumnCell]',
  providers: [
    { provide: NbTableDirective, useExisting: NbColumnCellDirective },
  ],
})
export class NbColumnCellDirective implements INbTableDirective {
  /**
   * The reference to the column cell.
   */
  @Input({ alias: 'nbColumnCell', required: true }) column!: string;

  constructor (
    public template: TemplateRef<{ dataItem: any; row: number; }>,
  ) { }
}

@Directive({
  selector: '[nbHeaderRow]',
  providers: [{ provide: NbTableDirective, useExisting: NbHeaderRowDirective }],
})
export class NbHeaderRowDirective implements INbTableDirective {
  constructor (
    public template: TemplateRef<any>,
  ) { }
}

@Directive({
  selector: '[nbRow]',
  providers: [{ provide: NbTableDirective, useExisting: NbRowDirective }],
})
export class NbRowDirective implements INbTableDirective {
  constructor (
    public template: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
  ) { }

  /**
   * Determines whether the row is expandable.
   * @returns Whether the row is expandable.
   */
  isExpandable(): boolean {
    return (<any>this._viewContainer['_hostTNode' as keyof ViewContainerRef])?.attrs?.includes('nbExpandableRow') || false;
  }
}

@Directive({
  selector: '[nbTableRow]',
})
export class NbTableRowDirective {
  /**
   * Outputs the click event on the row.
   * @returns The click event on the row, including the MouseEvent and data of the table row element.
   */
  @Output() click = new EventEmitter<{ click: MouseEvent, data: Record<string, unknown>; }>();

  constructor (private _element: ElementRef) {
    this._element.nativeElement.classList.add('nb-table-row');
  }

  /**
   * Gets the row element.
   * @returns The row element.
   */
  getRowElement(): ElementRef {
    return this._element;
  }
}

@Directive({
  selector: '[nbExpandableRow]',
})
export class NbExpandableRowDirective<C> {
  /**
   * Sets whether the row is expanded. Unless one ore more columns have been selected.
   * @param expand Whether the row is expanded.
   */
  @Input('nbExpandableRow') set expanded(expand: boolean) {
    if (this._tableService.tableState().selectedColumns?.length) return;

    this._element.nativeElement.classList.toggle('nb-expanded', expand);
  }

  /**
   * Outputs the click event on the row.
   * @returns The click event on the row, including the MouseEvent and data of the table row element.
   */
  @Output() click = new EventEmitter<{ click: MouseEvent, data: Record<string, unknown>; }>();

  constructor (private _element: ElementRef, private _tableService: NbTableService<any>) {
    this._element.nativeElement.classList.add('nb-expandable-row');

    effect(() => {
      const tableState = this._tableService.tableState();
      this._element.nativeElement.classList.toggle('nb-hidden', !!tableState.selectedColumns.length);
    });
  }

  /**
   * Gets the row element.
   * @returns The row element.
   */
  getRowElement(): ElementRef {
    return this._element;
  }
}

@Directive({
  selector: '[nbHeaderCell]',
  providers: [],
})
export class NbHeaderCellDirective implements OnInit {
  /**
   * The column header to display.
   */
  @Input({ alias: 'nbHeaderCell', required: true }) column!: string;

  /**
   * Whether the column is draggable.
   * @default false
   */
  @Input('nbHeaderCellDrag') drag: boolean = false;

  /**
   * Whether the column is resizable.
   * @default false
   */
  @Input('nbHeaderCellResize') resize: boolean = false;

  /**
   * The size of the column width.
   */
  @Input('nbHeaderCellSize') size?: number;

  /**
   * The minimum width of the column.
   */
  @Input('nbHeaderCellMin') min?: number;

  /**
   * The maximum width of the column.
   */
  @Input('nbHeaderCellMax') max?: number;

  private get _headerElement(): HTMLElement {
    return this._element.nativeElement;
  }

  constructor (private _element: ElementRef<HTMLElement>, private _tableService: NbTableService<any>, private renderer: Renderer2) {
    const columnWidths = this._tableService.getColumnWidths();
    effect(() => {
      const widths = columnWidths();
      if (!this.column) return;

      const width = widths.find((x) => x.column === this.column);
      if (this.max) return;
      if (width) this._headerElement.style.minWidth = `${width.width}px`;
    });
  }

  ngOnInit(): void {
    this._headerElement.classList.add('nb-header-cell');
    this._headerElement.draggable = this.drag;
    if (this.drag) this._headerElement.addEventListener('dragstart', this._draghandle);

    if (this.resize) this._appendResizer();
    if (this.size) {
      this._headerElement.style.maxWidth = `${this.size}px`;
      this._tableService.setColumnWidth({ column: this.column, width: this.size });
    }
  }

  /**
   * Handles the drag event and attaches the column name to the data of the event.
   * @param event The drag event.
   */
  private _draghandle = (event: DragEvent): void => {
    if (!event.dataTransfer) return;

    event.dataTransfer.effectAllowed = 'link';
    event.dataTransfer.setData('text/plain', this.column);
  };

  /**
   * Appends the resizer element to the header cell.
   */
  private _appendResizer(): void {
    const resizer = document.createElement('span');
    resizer.classList.add('nb-column-resize');
    resizer.addEventListener('mousedown', (event) => {
      const startX = event.pageX;
      const startWidth = (<HTMLElement>event.target)?.parentElement?.clientWidth;
      event.preventDefault();

      if (startWidth !== undefined) this._listenMouseMove(startX, startWidth);
    });

    this._element.nativeElement.appendChild(resizer);
  }

  /**
   * Listens to the mouse move event and updates the column width.
   * @param startX The start X position of the mouse.
   * @param startWidth The start width of the column.
   */
  private _listenMouseMove(startX: number, startWidth: number): void {
    const mouseMove = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
      const movedX = event.pageX - startX;
      const newWidth = startWidth + movedX;

      if (newWidth) this._tableService.setColumnWidth({ column: this.column, width: newWidth });
    });

    const mouseUp = this.renderer.listen('document', 'mouseup', () => {
      mouseMove();
      mouseUp();
    });
  }
}

@Directive({
  selector: '[nbCell]',
  providers: [],
})
export class NbCellDirective implements AfterViewChecked {
  /**
   * The reference to the column cell.
   */
  @Input({ alias: 'nbCell', required: true }) column!: string;

  /**
   * The row index of the cell.
   */
  @Input({ alias: 'nbCellRow', required: true }) set rowIndex(index: number) {
    if (index === null || index === undefined) return;

    this._rowIndex = index;
    this._cellElement.classList.add('nb-table-cell');

    this._cellElement.classList.toggle('nb-row-odd', (index + 1) % 2 !== 0);
    this._cellElement.classList.toggle('nb-row-even', (index + 1) % 2 === 0);

    const cellId = `${this.column}-${this._rowIndex}`;
    this._tableService.registerCell(cellId);
  }

  private get _cellElement(): HTMLElement {
    return this._element.nativeElement;
  }

  private _rowIndex!: number;

  constructor (
    private _element: ElementRef,
    private _tableService: NbTableService<any>,
  ) {
    this._determineSpan();
    this._determineRowHover();
    this._determineCellWidth();
    this._setupEventListeners();
  }

  ngAfterViewChecked(): void {
    const cellId = `${this.column}-${this._rowIndex}`;
    this._tableService.unregisterCell(cellId);
  }

  /**
   * Determines whether the cell is spanned or hidden and sets the appropriate class to the cell element.
   */
  private _determineSpan(): void {
    effect(() => {
      const tableState = this._tableService.tableState();
      const cellId = `${this.column}-${this._rowIndex}`;

      const classList = this._cellElement.classList;
      const spannedCells = tableState.spans;
      const hiddenCells = tableState.hiddenCells;

      for (var i = 0, l = classList.length; i < l; ++i) {
        if (/nb-span-.*/.test(classList[i])) classList.remove(classList[i]);
      }

      if (!spannedCells.has(cellId) && !hiddenCells.includes(cellId)) return;

      if (spannedCells.has(cellId)) {
        const span = spannedCells.get(cellId);
        this._cellElement.classList.add(`nb-span-${span!.span}`);
      }

      if (hiddenCells.includes(cellId)) {
        this._cellElement.classList.add('nb-span-hidden');
      }
    });
  }

  /**
   * Determines whether the row is hovered and sets the appropriate class to the cell element.
   */
  private _determineRowHover(): void {
    effect(() => {
      const hoveredRowIndex = this._tableService.hoveredRow();
      if (this._rowIndex == null) return;
      this._cellElement.classList.toggle(`nb-hovered-row`, hoveredRowIndex === this._rowIndex);
    });
  }

  /**
   * Determines the width of the cell and sets the width the to style properties of the cell element.
   */
  private _determineCellWidth(): void {
    const columnWidths = this._tableService.getColumnWidths();
    effect(() => {
      const widths = columnWidths();
      if (!this.column) return;

      const width = widths.find(x => x.column === this.column);
      if (width) this._cellElement.style.minWidth = `${width.width}px`;
    });
  }

  /**
   * Sets up the event listeners for the cell element.
   */
  private _setupEventListeners(): void {
    this._cellElement.addEventListener('click', (event: MouseEvent) => {
      const dataSource = this._tableService.dataSource();
      const row = this._tableService.getTableRows()?.[this._rowIndex];

      if (row) row.click.emit({ click: event, data: dataSource?.[this._rowIndex] });
    });

    (<HTMLElement>this._cellElement).addEventListener('mouseenter', () => {
      this._tableService.updateHoveredRow(this._rowIndex);
    });

    (<HTMLElement>this._cellElement).addEventListener('mouseleave', () => {
      this._tableService.updateHoveredRow(undefined);
    });
  }
}
