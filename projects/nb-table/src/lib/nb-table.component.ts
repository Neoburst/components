/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Signal,
  computed,
  effect,
} from '@angular/core';
import { filter, map, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { DirectiveContainer } from './nb-table-directives/directive-container';
import {
  INbTableDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbHeaderRowDirective,
  NbRowDirective,
  NbTableDirective,
  NbTableRowDirective,
} from './nb-table-directives/nb-table.directive';
import { NbTableDatasource, NbTableService } from './nb-table.service';
import { NbSort } from './nb-table-components/nb-table-sort/nb-table-sort.component';

interface DragHeader {
  index: number;
  label: string;
}

interface DragHeaderEvent {
  dragHeader: DragHeader;
  newIndex: number;
}

@Component({
  selector: 'nb-table',
  templateUrl: './nb-table.component.html',
  styleUrls: ['./nb-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NbTableService]
})
export class NbTableComponent<T> implements OnInit, OnDestroy {
  /**
   * The data source for the table. {@link NbTableDatasource}
   * Accepts an array of objects, Observable or Signal of an array of objects.
   * @param source The data source for the table.
  */
  @Input() set dataSource(source: NbTableDatasource<T>) {
    this._tableService.setSource(source);
  }

  /**
   * The selected columns to be displayed at the top of the table.
   * Based on these columns, the spanned cells will be calculated.
   * @param columns The columns to be displayed at the top of the table.
  */
  @Input() set activeColumns(columns: string[]) {
    this.selectedHeaders = columns;
  }

  @ContentChildren(NbTableDirective) set cells(_cells: QueryList<INbTableDirective>) {
    this._directiveContainer = new DirectiveContainer(_cells);
    this.headerRows = this._directiveContainer.getHeaderRowDirectives();
    this._originalColumnHeaders = this._directiveContainer.getColumnHeaderDirectives();
    this.columnHeaders = Object.assign([], this._originalColumnHeaders);
    this.tableRows = this._directiveContainer.getRowDirectives();
    this.expandableRows = this._directiveContainer.getExpandableRowDirectives();
    this._originalTableCells = this._directiveContainer.getColumnCellDirectives();
    this.tableCells = Object.assign([], this._originalTableCells);

    this._tableService.setColumns(this._originalColumnHeaders.map((h) => h.column));
  }

  @ContentChildren(NbTableRowDirective) set rows(_rows: QueryList<NbTableRowDirective>) {
    if (!_rows) return;
    this._tableService.setTableRows(_rows.toArray());
  }

  /**
   * The selected columns that have to been dragged to the top of the table.
   */
  @Output() selectedColumns = new EventEmitter<Array<string>>();

  /**
   * The columns that have been sorted.
   */
  @Output() sortedColumns = new EventEmitter<Array<NbSort>>();

  private _directiveContainer!: DirectiveContainer;
  headerRows!: NbHeaderRowDirective[];
  columnHeaders!: NbColumnHeaderDirective[];
  tableRows!: NbRowDirective[];
  expandableRows!: NbRowDirective[];
  tableCells!: NbColumnCellDirective[];

  columnTemplate!: string;

  private _originalColumnHeaders!: NbColumnHeaderDirective[];
  private _originalTableCells!: NbColumnCellDirective[];

  dataSourceSig: Signal<readonly T[] | undefined>;
  dataSourceLength: Signal<number> = computed(() => this.dataSourceSig()?.length ?? 0);
  // TODO - Remove and use the table service instead
  selectedHeaders: string[] = [];

  private _draggedHeader: DragHeader | undefined;
  private _dragHeaderQueue = new Subject<DragHeaderEvent>();
  private _dragLeave = new Subject<HTMLElement | undefined>();
  private _unsubscriber = new Subject<void>();

  constructor (private _cd: ChangeDetectorRef, private _tableService: NbTableService<T>) {
    this.dataSourceSig = this._tableService.dataSource;
    this._tableService.stable$.pipe(takeUntil(this._unsubscriber)).subscribe((stable) => {
      if (stable) this._rearrangeColumns();
    });

    effect(() => {
      const css = window.document.styleSheets[0];
      const dataLength = this.dataSourceLength();

      for (let i = 1; i <= dataLength; i++) {
        css.insertRule(`
            .nb-span-${i} {
              grid-row-start: span ${i};
            }
          `);
      }
    });

    effect(() => {
      const sorts = this._tableService.tableSorts();
      this.sortedColumns.emit(sorts);
    });

    effect(() => {
      const template = this._tableService.columnTemplate();
      this.columnTemplate = template;
      this._cd.detectChanges();
    });
  }

  ngOnInit(): void {
    this._listenToDragHeaderEvents();
  }

  ngOnDestroy(): void {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

  onDrag(event: DragEvent, header: string, index: number): void {
    this._draggedHeader = { index, label: header };

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', header);
    }
  }

  rearrangeHeaders(event: DragEvent, index: number): void {
    if ((event.dataTransfer && event.dataTransfer.effectAllowed !== 'move') || !this._draggedHeader || this.selectedHeaders[index] === this._draggedHeader.label) return;

    this._dragHeaderQueue.next({ dragHeader: this._draggedHeader, newIndex: index });
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) return;

    if (event.dataTransfer.effectAllowed === 'move') {
      this._draggedHeader = undefined;
      return;
    } else if (event.dataTransfer.effectAllowed === 'link' && !this.selectedHeaders.includes(event.dataTransfer.getData('text/plain'))) {
      this.selectedHeaders = [...this.selectedHeaders, event.dataTransfer.getData('text/plain')];
      this._rearrangeColumns();

      (<HTMLElement>event.target).classList.remove('expanded');
    }
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.selectedHeaders.length === 0) this._dragLeave.next(undefined);
  }

  dragEnter(event: DragEvent): void {
    event.preventDefault();
    if (this.selectedHeaders.length === 0 && !(<HTMLElement>event.target).classList.contains('expanded') && event.dataTransfer?.effectAllowed === 'link')
      (<HTMLElement>event.target).classList.add('expanded');
  }

  dragLeave(event: DragEvent): void {
    event.preventDefault();
    if (this.selectedHeaders.length === 0 && (<HTMLElement>event.target).classList.contains('expanded'))
      this._dragLeave.next((<HTMLElement>event.target));
  }

  removeHeader(index: number): void {
    this.selectedHeaders.splice(index, 1);
    this.selectedHeaders = [...this.selectedHeaders];
    this._rearrangeColumns();
  }

  private _rearrangeColumns(): void {
    this.selectedColumns.emit(this.selectedHeaders);
    this._tableService.setSelectedColumns(this.selectedHeaders);
    this._resetOrder();

    this.columnHeaders = this.columnHeaders.sort((h1, h2) => this._determineOrder(h1, h2));
    this.tableCells = this.tableCells.sort((c1, c2) => this._determineOrder(c1, c2));
  }

  private _resetOrder(): void {
    this.columnHeaders = Object.assign([], this._originalColumnHeaders);
    this.tableCells = Object.assign([], this._originalTableCells);
  }

  private _determineOrder(d1: NbColumnHeaderDirective | NbColumnCellDirective, d2: NbColumnHeaderDirective | NbColumnCellDirective): number {
    const d1Index = this.selectedHeaders.findIndex(h => h === d1.column);
    const d2Index = this.selectedHeaders.findIndex(h => h === d2.column);

    if (d1Index > -1 && d2Index === -1) return -1;
    if (d1Index === -1 && d2Index === -1) return 0;
    if (d1Index === -1 && d2Index > -1) return 1;

    if (d1Index < d2Index) return -1;
    if (d1Index > d2Index) return 1;

    return 0;
  }

  private _listenToDragHeaderEvents(): void {
    this._dragLeave.pipe(
      takeUntil(this._unsubscriber),
      switchMap((element) => timer(500).pipe(map(() => element))),
      filter((element): element is HTMLElement => !!element),
    ).subscribe((element) => element.classList.remove('expanded'));

    this._dragHeaderQueue.pipe(
      takeUntil(this._unsubscriber),
      filter((event) => event.newIndex != null),
      switchMap((dragHeaderEvent) => timer(150).pipe(map(() => dragHeaderEvent)))
    ).subscribe((dragHeaderEvent) => {
      this.selectedHeaders.splice(dragHeaderEvent.newIndex, 0, ...this.selectedHeaders.splice(dragHeaderEvent.dragHeader.index, 1));
      this._rearrangeColumns();
    });
  }
}
