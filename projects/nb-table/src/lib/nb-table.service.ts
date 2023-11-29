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

  setSource(source: NbTableDatasource<T>): void {
    if (typeof source === 'object' && source.constructor === Array) this._dataSource.set(source);
    else if (typeof source === 'object' && source instanceof Observable) this.dataSource = toSignal(source, { injector: this._injector });
    else if (typeof source === 'function') this.dataSource = source;

    else throw Error('Invalid value provided for NbTableDatasource.');
  }

  setColumns(columns: string[]): void {
    this._columns.set(columns);
  }

  setSelectedColumns(columns: string[]): void {
    this._selectedColumns.update(_ => columns);
  }

  setTableRows(rows: NbTableRowDirective[]): void {
    this._tableRows = rows;
  }

  getTableRows(): NbTableRowDirective[] | undefined {
    return this._tableRows;
  }

  registerCell(cellId: string): void {
    if (this._cellRenderQueue.includes(cellId)) return;

    this._cellRenderQueue = [...this._cellRenderQueue, cellId];
    this._cellRenderQueueB$.next(this._cellRenderQueue);
  }

  unregisterCell(cellId: string): void {
    if (!this._cellRenderQueue.includes(cellId)) return;

    const index = this._cellRenderQueue.findIndex((id) => id === cellId);
    if (index >= 0) {
      this._cellRenderQueue.splice(index, 1);
      this._cellRenderQueueB$.next(this._cellRenderQueue);
    }
  }

  get hoveredRow(): Signal<number | undefined> {
    return this._hoveredRow;
  }

  updateHoveredRow(index: number | undefined): void {
    this._hoveredRow.set(index);
  }

  setColumnSort(sort: NbSort): void {
    this._tableSorts.update((activeSorts) => {
      let sorts = [...activeSorts];
      const index = sorts.findIndex((s) => s.column === sort.column);
      if (index >= 0) sorts.splice(index, 1, sort);
      else sorts = [...sorts, sort];

      return sorts;
    });
  }

  removeColumnSort(column: string): void {
    this._tableSorts.update((activeSorts) => {
      let sorts = [...activeSorts];
      const index = sorts.findIndex((s) => s.column === column);
      if (index >= 0) sorts.splice(index, 1);

      return sorts;
    });
  }

  setColumnWidth(columnWidth: NbColumnWidth): void {
    this._columnWidths.update((columnWidths) => {
      let widths = [...columnWidths];
      const index = widths.findIndex((c) => c.column === columnWidth.column);
      if (index >= 0) widths.splice(index, 1, columnWidth);
      else widths = [...widths, columnWidth];

      return widths;
    });
  }

  getColumnWidths(): Signal<NbColumnWidth[]> {
    return this._columnWidths;
  }

  private _observeSpannedCells(): void {
    this.tableState = computed(() => this._mapToTableStateAlpha(this.dataSource(), this._selectedColumns()));
  }

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
