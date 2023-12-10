/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import { Injectable, Injector, Signal, WritableSignal, computed, signal } from '@angular/core';
import { distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NbTableRowDirective } from './nb-table-directives/nb-table.directive';
import { NbSort } from './nb-table-components/nb-table-sort/nb-table-sort.component';
import { findKey } from './helper/find-key';

export type NbTableDatasource<T> = readonly T[] | Observable<readonly T[]> | Signal<readonly T[]>;

interface SpannedCell {
  column: string;
  rowIndex: number;
  span: number;
}

interface ColumnSpan {
  id: string;
  span: number;
  value: unknown;
  index: number;
}

interface TableState {
  hiddenCells: string[];
  selectedColumns: string[];
  spans: Map<string, SpannedCell>;
}

export interface NbColumnWidth {
  column: string;
  width: number;
}

@Injectable()
export class NbTableService<T> {
  private _dataSource: WritableSignal<readonly T[]> = signal([]);
  dataSource: Signal<readonly T[] | undefined> = this._dataSource;
  tableState!: Signal<TableState>;

  private _cellRenderQueue: Array<string> = [];
  private _cellRenderQueueB$ = new Subject<Array<string>>();
  stable$: Observable<boolean>;

  columnTemplate!: Signal<string>;
  private _columns: WritableSignal<string[]> = signal([]);
  private _selectedColumns: WritableSignal<string[]> = signal([]);
  private _tableRows?: NbTableRowDirective[];

  private _hoveredRow: WritableSignal<number | undefined> = signal(undefined);

  private _tableSorts: WritableSignal<Array<NbSort>> = signal([]);
  tableSorts: Signal<Array<NbSort>> = this._tableSorts;

  private _columnWidths: WritableSignal<Array<NbColumnWidth>> = signal([]);

  constructor (private _injector: Injector) {
    this._observeSpannedCells();
    this._observeColumnWidths();

    this.stable$ = this._cellRenderQueueB$.asObservable()
      .pipe(
        map((queue) => queue.length === 0),
        distinctUntilChanged()
      );
  }

  /**
   * Sets the data source for the table. The data source can be an array, an observable or a signal.
   * @param source The data source for the table. {@link NbTableDatasource}
   * @throws Error if the data source is not an array, an observable or a signal.
   */
  setSource(source: NbTableDatasource<T>): void {
    if (typeof source === 'object' && source.constructor === Array) this._dataSource.set(source);
    else if (typeof source === 'object' && source instanceof Observable) this.dataSource = toSignal(source, { injector: this._injector });
    else if (typeof source === 'function') this.dataSource = source;

    else throw Error('Invalid value provided for NbTableDatasource.');
  }

  /**
   * Sets the columns for the table.
   * @param columns The columns for the table.
   */
  setColumns(columns: string[]): void {
    this._columns.set(columns);
  }

  /**
   * Sets the selected columns for the table. Based on these columns
   * the spanned cells will be calculated.
   * @param columns The selected columns for the table.
   */
  setSelectedColumns(columns: string[]): void {
    this._selectedColumns.update(_ => columns);
  }

  /**
   * Sets the table rows.
   * @param rows The table rows.
   */
  setTableRows(rows: NbTableRowDirective[]): void {
    this._tableRows = rows;
  }

  /**
   * Returns the table rows.
   * @returns The table rows.
   */
  getTableRows(): NbTableRowDirective[] | undefined {
    return this._tableRows;
  }

  /** 
   * Registers a cell for rendering. This is used to determine if the table is stable or not.
  */
  registerCell(cellId: string): void {
    if (this._cellRenderQueue.includes(cellId)) return;

    this._cellRenderQueue = [...this._cellRenderQueue, cellId];
    this._cellRenderQueueB$.next(this._cellRenderQueue);
  }

  /** 
   * Unregisters a cell for rendering. This is used to determine if the table is stable or not.
  */
  unregisterCell(cellId: string): void {
    if (!this._cellRenderQueue.includes(cellId)) return;

    const index = this._cellRenderQueue.findIndex((id) => id === cellId);
    if (index >= 0) {
      this._cellRenderQueue.splice(index, 1);
      this._cellRenderQueueB$.next(this._cellRenderQueue);
    }
  }

  /**
   * Returns the hovered row index.
   * @returns The hovered row index.
   */
  get hoveredRow(): Signal<number | undefined> {
    return this._hoveredRow;
  }

  /**
   * Updates the hovered row index.
   */
  updateHoveredRow(index: number | undefined): void {
    this._hoveredRow.set(index);
  }

  /**
   * Updates the selected column sorts of the table.
   * @param sort The selected column sort.
   */
  setColumnSort(sort: NbSort): void {
    this._tableSorts.update((activeSorts) => {
      let sorts = [...activeSorts];
      const index = sorts.findIndex((s) => s.column === sort.column);
      if (index >= 0) sorts.splice(index, 1, sort);
      else sorts = [...sorts, sort];

      return sorts;
    });
  }

  /**
   * Removes the selected column sort from the table.
   * @param column The column to remove the sort from.
   */
  removeColumnSort(column: string): void {
    this._tableSorts.update((activeSorts) => {
      let sorts = [...activeSorts];
      const index = sorts.findIndex((s) => s.column === column);
      if (index >= 0) sorts.splice(index, 1);

      return sorts;
    });
  }

  /**
   * Updates the column width of the table.
   * @param columnWidth The column width to update.
   */
  setColumnWidth(columnWidth: NbColumnWidth): void {
    this._columnWidths.update((columnWidths) => {
      let widths = [...columnWidths];
      const index = widths.findIndex((c) => c.column === columnWidth.column);
      if (index >= 0) widths.splice(index, 1, columnWidth);
      else widths = [...widths, columnWidth];

      return widths;
    });
  }

  /**
   * Returns the column widths of the table.
   * @returns The column widths of the table.
   */
  getColumnWidths(): Signal<NbColumnWidth[]> {
    return this._columnWidths;
  }

  private _observeSpannedCells(): void {
    this.tableState = computed(() => this._mapToTableStateAlpha(this.dataSource(), this._selectedColumns()));
  }

  /**
   * Observes the column widths and updates the column template.
   * When a column width is set, the column template is updated.
   * This template is a string property to be used with the grid-template-columns css property.
   */
  private _observeColumnWidths(): void {
    this.columnTemplate = computed(() => {
      const selectedColumns = this._selectedColumns();
      const cols = this._columns();
      const widths = this._columnWidths();
      const columns = [...selectedColumns, ...cols].filter((v, i, a) => a.indexOf(v) === i);

      if (widths.length) {
        return columns.map((column) => {
          const width = widths.findIndex((w) => w.column === column);
          return `[col-${column}] ${width >= 0 ? 'max-content' : 'auto'}`;
        }).join(' ');
      }

      return `repeat(${columns.length}, auto)`;
    });
  }

  // private _mapToTableState(source: readonly T[] | undefined, columns: string[]): TableState {
  //   const spans = new Map<string, SpannedCell>();
  //   let hiddenCells = <string[]>[];

  //   if (!source) return { hiddenCells, selectedColumns: [], spans };

  //   columns.forEach((column) => {
  //     const dataColumn = source.map((x) => x[findKey(<T extends Object ? T : any>x, column) as keyof T]);

  //     const columnSpans = dataColumn.reduce((acc: { id: string, span: number, value: unknown, index: number; }[], prev, index) => {
  //       if (!acc.length || prev !== acc[acc.length - 1].value) acc = [...acc, { id: `${column}-${index}`, span: 1, value: prev, index }];
  //       else if (prev === acc[acc.length - 1].value) {
  //         acc[acc.length - 1].span++;
  //         hiddenCells = [...hiddenCells, `${column}-${index}`];
  //       }

  //       return acc;
  //     }, []) as { id: string, span: number, value: unknown, index: number; }[];

  //     columnSpans.filter((x) => x.span > 1).forEach((x) => {
  //       spans.set(x.id, { column: column, rowIndex: x.index, span: x.span });
  //     });
  //   });

  //   return { hiddenCells, selectedColumns: columns, spans };
  // }

  /**
   * Finds the spanned and hidden cells for each table column.
   * Reduces the column values, compares each value with the next one and if they are equal, it adds the next cell to the hidden cells array.
   * @param columnValues The values of each cell in the column.
   * @param column The column name.
   * @returns The spans {@link SpannedCell} and hidden cells for the column.
   */
  private _findSpans(columnValues: T[keyof T][], column: string): { spans: { [key: string]: SpannedCell; }, hiddenCells: string[]; } {
    let hiddenCells = <string[]>[];
    const spans = columnValues.reduce((spans, columnValue, index, values) => {
      let span = 1;

      if (hiddenCells.includes(`${column}-${index}`)) return spans;

      while (columnValue === values[index + span]) {
        spans = { ...spans, [`${column}-${index}`]: { column, rowIndex: index, span: span + 1 } };
        hiddenCells = [...hiddenCells, `${column}-${index + span}`];

        span++;
      }

      return spans;
    }, <{ [key: string]: SpannedCell; }>{});
    return { spans, hiddenCells };
  }

  /**
   * Maps the data source to a table state. The table state contains the hidden cells, selected columns and spans.
   * Reduces the columns based on the selected columns and finds the spanned and hidden cells for each of them.
   * @param source The data source of the table.
   * @param columns The table columns.
   * @returns The table state {@link TableState}.
   */
  private _mapToTableStateAlpha(source: readonly T[] | undefined, columns: string[]): TableState {
    const spans = new Map<string, SpannedCell>();
    let hiddenCells = <string[]>[];

    if (!source) return { hiddenCells, selectedColumns: [], spans };

    const colSpans = columns.reduce((spans, column) => {
      const columnValues = source.map((row) => row[findKey(<T extends Object ? T : any>row, column) as keyof T]);
      const partialState = this._findSpans(columnValues, column);
      spans = { ...spans, ...partialState.spans };
      hiddenCells = [...hiddenCells, ...partialState.hiddenCells];

      return spans;
    }, <{ [key: string]: SpannedCell; }>{});

    return { hiddenCells, selectedColumns: columns, spans: new Map(Object.entries(colSpans)) };
  }
}
