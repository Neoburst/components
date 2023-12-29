/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import { findKey } from '../../helper/find-key';
import { NbSort } from './nb-table-sort.component';

/**
 * Sorts an array of objects by the given sorts.
 * @param sorts The sorts to apply. {@link NbSort}
 * @returns A function to use with Array.sort().
 */
export function nbSortBy<T extends Object, K extends keyof T>(sorts: NbSort[]): (a: T, b: T) => number {
  return (a, b) => sorts.reduce((order, sort) => {
    return order || _sortCompare(a, b, findKey<T, K>(a, <string>sort.column) as K, sort.direction === 'asc');
  }, 0);
}

/**
 * Sorts two objects by the given property.
 * @param a The first object to compare.
 * @param b The second object to compare.
 * @param prop The property to compare.
 * @param ascending Whether to sort ascending or descending.
 * @returns The result of the comparison.
 */
function _sortCompare<T, K extends keyof T>(a: T, b: T, prop: K | undefined, ascending: boolean): number {
  if (prop == null) return 0;
  if (typeof a[prop] === 'string') return (<string>a[prop]).localeCompare(<string>b[prop]) * (ascending ? 1 : -1);
  return (a[prop] == b[prop] ? 0 : a[prop] < b[prop] ? -1 : 1) * (ascending ? 1 : -1);
}