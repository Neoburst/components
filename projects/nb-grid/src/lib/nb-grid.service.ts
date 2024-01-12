import { Injectable, signal } from '@angular/core';
import { NbGridItem } from './directives/nb-grid-item.directive';

type GridItemState = { [key: string]: NbGridItem; };

@Injectable()
export class NbGridService {
  private readonly _itemIdPrefix = 'nb-grid-item-';
  private _itemId = 0;
  private _gridItems = signal<GridItemState>({});

  gridItemState = this._gridItems.asReadonly();

  registerItem(element: HTMLElement, gridItem: NbGridItem): string {
    const itemId = `${this._itemIdPrefix}${this._itemId++}`;

    element.setAttribute('nb-grid-item', itemId);
    this._gridItems.update((gridItems) => ({ ...gridItems, [itemId]: gridItem }));

    return itemId;
  }

  getItem(itemId: string | undefined): NbGridItem | undefined {
    return itemId ? this._gridItems()[itemId] : undefined;
  }

  updateItem(itemId: string, gridItem: NbGridItem): void {
    this._gridItems.update((gridItems) => ({ ...gridItems, [itemId]: gridItem }));
  }

  removeItem(itemId: string): void {
    this._gridItems.update((gridItems) => {
      const { [itemId]: _, ...remainingItems } = gridItems;
      return remainingItems;
    });
  }
}
