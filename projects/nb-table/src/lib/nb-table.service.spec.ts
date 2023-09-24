import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { NbTableDatasource, NbTableService } from './nb-table.service';
import { MOCK_DATA } from '../test-data/mock_data';
import { of, startWith } from 'rxjs';
import { signal } from '@angular/core';
import { nbSortBy } from './nb-table-components/nb-table-sort/nb-sort-functions';

describe('NbTableService', () => {
  let tableService: NbTableService<any>;
  const datasource = MOCK_DATA;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NbTableService]
    });
    tableService = TestBed.inject(NbTableService);
  });

  it('should be created', () => {
    expect(tableService).toBeTruthy();
  });

  describe('set datasource', () => {
    it('should set array datasource', () => {
      // arrange

      // act
      tableService.setSource(datasource);
      const result = tableService.dataSource();

      // assert
      expect(result).toBe(datasource);
    });

    it('should set observable datasource', () => {
      // arrange

      // act
      tableService.setSource(of(datasource));
      const result = tableService.dataSource();

      // assert
      expect(result).toBe(datasource);
    });

    it('should set signal datasource', () => {
      // arrange

      // act
      tableService.setSource(signal(datasource));
      const result = tableService.dataSource();

      // assert
      expect(result).toBe(datasource);
    });

    it('should throw error when invalid datasource is provided', () => {
      // arrange

      // act
      try {
        tableService.setSource('invalidSource' as unknown as NbTableDatasource<any>);
      } catch (e: any) {
        expect(e.message).toBe('Invalid value provided for NbTableDatasource.');
      }
    });
  });

  describe('spanned columns', () => {
    it('should span columns when selecting age', () => {
      // arrange
      tableService.setSource(datasource.sort(nbSortBy([{ column: 'age', direction: 'asc' }])));

      // act
      tableService.setSelectedColumns(['age']);
      const result = tableService.tableState();

      // assert
      expect(result.spans.has('age-0')).toBeTruthy();
      expect(result.spans.get('age-0')?.span).toBe(3);
    });

    it('should span columns when selecting multiple columns', () => {
      // arrange
      tableService.setSource(datasource.sort(nbSortBy([{ column: 'age', direction: 'asc' }])));

      // act
      tableService.setSelectedColumns(['age', 'gender']);
      const result = tableService.tableState();

      // assert
      expect(result.spans.has('age-0')).toBeTruthy();
      expect(result.spans.get('age-0')?.span).toBe(3);
      expect(result.spans.has('gender-3')).toBeTruthy();
      expect(result.spans.get('gender-3')?.span).toBe(4);
    });
  });

  describe('grid column template', () => {
    it('should return default template without column widths', () => {
      // arrange
      tableService.setColumns(['firstName', 'lastName', 'age', 'gender', 'email', 'id']);

      // act
      const result = tableService.columnTemplate();

      // assert
      expect(result).toBe('repeat(6, auto)');
    });

    it('should return a specific template with column width', () => {
      // arrange
      tableService.setColumns(['firstName', 'lastName', 'age', 'gender', 'email', 'id']);
      tableService.setColumnWidth({ column: 'age', width: 100 });

      // act
      const result = tableService.columnTemplate();

      // assert
      expect(result).toBe('[col-firstName] auto [col-lastName] auto [col-age] max-content [col-gender] auto [col-email] auto [col-id] auto');
    });

    it('should update position in template of selected column with column width', () => {
      // arrange
      tableService.setColumns(['firstName', 'lastName', 'age', 'gender', 'email', 'id']);
      tableService.setColumnWidth({ column: 'age', width: 100 });

      // act
      const result1 = tableService.columnTemplate();

      // assert
      expect(result1).toBe('[col-firstName] auto [col-lastName] auto [col-age] max-content [col-gender] auto [col-email] auto [col-id] auto');

      // act
      tableService.setSelectedColumns(['age']);
      const result2 = tableService.columnTemplate();

      // assert
      expect(result2).toBe('[col-age] max-content [col-firstName] auto [col-lastName] auto [col-gender] auto [col-email] auto [col-id] auto');
    });
  });

  describe('stable', () => {
    it('should mark table as unstable when cell render queue is not empty', fakeAsync(() => {
      // arrange
      tableService.registerCell('age-0');

      // act
      let result;
      tableService.stable$.pipe(startWith(false)).subscribe((x) => result = x);
      flush();

      // assert
      expect(result).toBeFalsy();
    }));

    it('should mark table as stable when cell render queue is empty', fakeAsync(() => {
      // arrange
      tableService.registerCell('email-4');

      // act
      let unstable;
      tableService.stable$.pipe(startWith(false)).subscribe((x) => unstable = x);
      flush();

      // assert
      expect(unstable).toBeFalsy();

      // act
      let stable;
      tableService.unregisterCell('email-4');
      tableService.stable$.pipe(startWith([])).subscribe((x) => stable = x);
      flush();

      // assert
      expect(stable).toBeTruthy();
    }));
  });

  describe('table sorts', () => {
    it('should set a table sort', () => {
      // arrange

      // act
      tableService.setColumnSort({ column: 'age', direction: 'asc' });
      const result = tableService.tableSorts();

      // assert
      expect(result).toStrictEqual([{ column: 'age', direction: 'asc' }]);
    });

    it('should update direction of existing table sort', () => {
      // arrange

      // act
      tableService.setColumnSort({ column: 'age', direction: 'asc' });
      const sorts = tableService.tableSorts();

      // assert
      expect(sorts).toStrictEqual([{ column: 'age', direction: 'asc' }]);

      // act
      tableService.setColumnSort({ column: 'age', direction: 'desc' });
      const sortsDesc = tableService.tableSorts();

      // assert
      expect(sortsDesc).toStrictEqual([{ column: 'age', direction: 'desc' }]);
    });

    it('should remove a table sort', () => {
      // arrange

      // act
      tableService.setColumnSort({ column: 'age', direction: 'asc' });
      const sorts = tableService.tableSorts();

      // assert
      expect(sorts).toStrictEqual([{ column: 'age', direction: 'asc' }]);

      // act
      tableService.removeColumnSort('age');
      const result = tableService.tableSorts();

      // assert
      expect(result).toStrictEqual([]);
    });
  });
});
