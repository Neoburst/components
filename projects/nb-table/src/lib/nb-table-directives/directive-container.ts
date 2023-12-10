/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import { QueryList } from '@angular/core';
import {
  INbTableDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbHeaderRowDirective,
  NbRowDirective,
} from './nb-table.directive';

export class DirectiveContainer {
  constructor (private _directives: QueryList<INbTableDirective>) { }

  /**
   * Get the column header directives. {@link NbColumnHeaderDirective}
   * @returns The column header directives.
   */
  getColumnHeaderDirectives(): NbColumnHeaderDirective[] {
    return <NbColumnHeaderDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbColumnHeaderDirective
      )
    );
  }

  /**
   * Get the column cell directives. {@link NbColumnCellDirective}
   * @returns The column cell directives.
   */
  getColumnCellDirectives(): NbColumnCellDirective[] {
    return <NbColumnCellDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbColumnCellDirective
      )
    );
  }

  /**
   * Get the header row directives. {@link NbHeaderRowDirective}
   * @returns The header row directives.
   */
  getHeaderRowDirectives(): NbHeaderRowDirective[] {
    return <NbHeaderRowDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbHeaderRowDirective
      )
    );
  }

  /**
   * Get the row directives. {@link NbRowDirective}
   * @returns The row directives.
   */
  getRowDirectives(): NbRowDirective[] {
    return <NbRowDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbRowDirective && !d.isExpandable()
      )
    );
  }

  /**
   * Get the expandable row directives. {@link NbRowDirective}
   * @returns The expandable row directives.
   */
  getExpandableRowDirectives(): NbRowDirective[] {
    return <NbRowDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbRowDirective && d.isExpandable()
      )
    );
  }
}
