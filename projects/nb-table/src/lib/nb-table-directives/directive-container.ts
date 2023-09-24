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

  getColumnHeaderDirectives(): NbColumnHeaderDirective[] {
    return <NbColumnHeaderDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbColumnHeaderDirective
      )
    );
  }

  getColumnCellDirectives(): NbColumnCellDirective[] {
    return <NbColumnCellDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbColumnCellDirective
      )
    );
  }

  getHeaderRowDirectives(): NbHeaderRowDirective[] {
    return <NbHeaderRowDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbHeaderRowDirective
      )
    );
  }

  getRowDirectives(): NbRowDirective[] {
    return <NbRowDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbRowDirective && !d.isExpandable()
      )
    );
  }

  getExpandableRowDirectives(): NbRowDirective[] {
    return <NbRowDirective[]>(
      this._directives.filter(
        (d: INbTableDirective) => d instanceof NbRowDirective && d.isExpandable()
      )
    );
  }
}
