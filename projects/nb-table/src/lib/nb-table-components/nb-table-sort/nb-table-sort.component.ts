/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

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
  /**
   * The id of the column to sort.
   */
  @Input({ alias: 'nb-table-sort', required: true }) id!: string;

  /**
   * {@link NbSortDirection}
   * The default sort direction at which to start. Defaults to 'asc' when no value is set.
   */
  @Input('nb-sort-start') start: NbSortDirection | undefined;

  /**
   * Whether sorting is disabled for this column.
   */
  @Input('nb-sort-disabled') disabled: boolean = false;

  /**
   * The active sort for this column.
   */
  activeSort!: Signal<NbSort | undefined>;

  /**
   * The icon to display for the current sort direction.
   */
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

  /**
   * Sets the sort direction for this column.
   * @param dir The direction to sort.
   */
  setSort(dir?: NbSortDirection): void {
    const activeSort = this.activeSort();
    const direction = activeSort?.direction;

    if (!activeSort) this._nbTableService.setColumnSort({ column: this.id, direction: dir || 'asc' });
    if (direction === 'asc') this._nbTableService.setColumnSort({ column: this.id, direction: dir || 'desc' });
    if (direction === 'desc') this._nbTableService.removeColumnSort(this.id);
  }

  /**
   * Maps a {@link NbSortDirection} to a {@link DirectionIcon}.
   * @param direction The direction to map.
   * @returns The mapped icon.
   */
  private _mapDirectionToIcon(direction: NbSortDirection | undefined): DirectionIcon {
    switch (direction) {
      case 'asc': return 'arrow-up';
      case 'desc': return 'arrow-down';
      default: return 'arrow-up';
    }
  }
} 
