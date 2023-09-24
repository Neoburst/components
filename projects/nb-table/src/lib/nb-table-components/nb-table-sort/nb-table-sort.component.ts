import { Component, Input, OnInit, Signal, computed } from '@angular/core';
import { NbTableService } from '../../nb-table.service';

export type NbSortDirection = 'asc' | 'desc';

export interface NbSort<T = any> {
  column: keyof T;
  direction: NbSortDirection;
}

type DirectionIcon = 'arrow-down' | 'arrow-up';

@Component({
  selector: '[nb-table-sort]',
  templateUrl: './nb-table-sort.component.html',
  styleUrls: ['./nb-table-sort.component.scss']
})
export class NbTableSortComponent implements OnInit {
  @Input({ alias: 'nb-table-sort', required: true }) id!: string;
  @Input('nb-sort-start') start: NbSortDirection | undefined;
  @Input('nb-sort-disabled') disabled: boolean = false;

  activeSort!: Signal<NbSort | undefined>;
  directionIcon!: Signal<DirectionIcon>;

  constructor (private _nbTableService: NbTableService<any>) { }

  ngOnInit(): void {
    this.activeSort = computed(() => {
      const activeSorts = this._nbTableService.tableSorts();
      return activeSorts.find((s) => s.column === this.id);
    });
    this.directionIcon = computed(() => this._mapDirectionToIcon(this.activeSort()?.direction));

    if (this.start) this.setSort(this.start);
  }

  setSort(dir?: NbSortDirection): void {
    const activeSort = this.activeSort();
    const direction = activeSort?.direction;

    if (!activeSort) this._nbTableService.setColumnSort({ column: this.id, direction: dir || 'asc' });
    if (direction === 'asc') this._nbTableService.setColumnSort({ column: this.id, direction: dir || 'desc' });
    if (direction === 'desc') this._nbTableService.removeColumnSort(this.id);
  }

  private _mapDirectionToIcon(direction: NbSortDirection | undefined): DirectionIcon {
    switch (direction) {
      case 'asc': return 'arrow-up';
      case 'desc': return 'arrow-down';
      default: return 'arrow-up';
    }
  }
} 
