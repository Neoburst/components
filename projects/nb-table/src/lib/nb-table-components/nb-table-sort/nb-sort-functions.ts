import { findKey } from '../../helper/find-key';
import { NbSort } from './nb-table-sort.component';

export function nbSortBy<T extends Object, K extends keyof T>(sorts: NbSort[]): (a: T, b: T) => number {
  return (a, b) => sorts.reduce((order, sort) => {
    return order || _sortCompare(a, b, findKey<T, K>(a, <string>sort.column) as K, sort.direction === 'asc');
  }, 0);
}

function _sortCompare<T, K extends keyof T>(o1: T, o2: T, prop: K | undefined, ascending: boolean): number {
  if (prop == null) return 0;
  if (typeof o1[prop] === 'string') return (<string>o1[prop]).localeCompare(<string>o2[prop]) * (ascending ? 1 : -1);
  return ((<any>o1[prop]) == (<any>o2[prop]) ? 0 : (<any>o1[prop]) < (<any>o2[prop]) ? -1 : 1) * (ascending ? 1 : -1);
}