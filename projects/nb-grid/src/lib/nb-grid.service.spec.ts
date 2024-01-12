import { TestBed } from '@angular/core/testing';

import { NbGridService } from './nb-grid.service';
import { NbGridItem } from './directives/nb-grid-item.directive';

describe('NbGridService', () => {
  let service: NbGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NbGridService]
    });
    service = TestBed.inject(NbGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register item', () => {
    // arrange
    const element = document.createElement('div');
    const gridItem = { cols: 1, rows: 1 } as NbGridItem;

    // act
    const itemId = service.registerItem(element, gridItem);

    // assert
    expect(element.getAttribute('nb-grid-item')).toBe(itemId);
    expect(service.getItem(itemId)).toBe(gridItem);
    expect(service.gridItemState()).toEqual({ [itemId]: gridItem });
  });

  it('should update item', () => {
    // arrange
    const element = document.createElement('div');
    const gridItem = { cols: 1, rows: 1 } as NbGridItem;
    const itemId = service.registerItem(element, gridItem);
    const updatedGridItem = { cols: 2, rows: 2 } as NbGridItem;

    // act
    service.updateItem(itemId, updatedGridItem);

    // assert
    expect(service.getItem(itemId)).toBe(updatedGridItem);
    expect(service.gridItemState()).toEqual({ [itemId]: updatedGridItem });
  });

  it('should remove item', () => {
    // arrange
    const element = document.createElement('div');
    const gridItem = { cols: 1, rows: 1 } as NbGridItem;
    const itemId = service.registerItem(element, gridItem);

    // act
    service.removeItem(itemId);

    // assert
    expect(service.getItem(itemId)).toBeUndefined();
    expect(service.gridItemState()).toEqual({});
  });
});
