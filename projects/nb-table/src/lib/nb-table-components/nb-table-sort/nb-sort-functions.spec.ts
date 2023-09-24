import { MOCK_DATA, MockPerson } from '../../../test-data/mock_data';
import { nbSortBy } from './nb-sort-functions';
import { NbSort } from './nb-table-sort.component';

const datasource = MOCK_DATA;

describe('nbSortBy', () => {
  it('should sort datasource ascending by first name', () => {
    // arrange
    const sort: NbSort<MockPerson>[] = [{ column: 'firstName', direction: 'asc' }];

    // act
    const result = [...datasource].sort(nbSortBy(sort));

    // assert
    expect(result[0]).toBe(datasource[16]);
  });

  it('should sort datasource descending by first name', () => {
    // arrange
    const sort: NbSort<MockPerson>[] = [{ column: 'firstName', direction: 'desc' }];

    // act
    const result = [...datasource].sort(nbSortBy(sort));

    // assert
    expect(result[0]).toBe(datasource[11]);
  });

  it('should sort datasource ascending by age', () => {
    // arrange
    const sort: NbSort<MockPerson>[] = [{ column: 'age', direction: 'asc' }];

    // act
    const result = [...datasource].sort(nbSortBy(sort));

    // assert
    expect(result[0]).toBe(datasource[30]);
  });

  it('should sort datasource with capitalised key', () => {
    // arrange
    const sort: NbSort[] = [{ column: 'eMaIl', direction: 'asc' }];

    // act
    const result = [...datasource].sort(nbSortBy(sort));

    // assert
    expect(result[0]).toBe(datasource[35]);
  });

  it('should not sort datasource with empty array', () => {
    // arrange
    const sort: NbSort<MockPerson>[] = [];

    // act
    const result = [...datasource].sort(nbSortBy(sort));

    // assert
    expect(result[0]).toBe(datasource[0]);
  });

  describe('sort by two columns', () => {
    it('should sort datasource by age and first name ascending', () => {
      // arrange
      const sort: NbSort<MockPerson>[] = [{ column: 'age', direction: 'asc' }, { column: 'firstName', direction: 'asc' }];

      // act
      const result = [...datasource].sort(nbSortBy(sort));

      // assert
      expect(result[0]).toBe(datasource[35]);
    });

    it('should sort datasource by age ascending and first name descending', () => {
      // arrange
      const sort: NbSort<MockPerson>[] = [{ column: 'age', direction: 'asc' }, { column: 'firstName', direction: 'desc' }];

      // act
      const result = [...datasource].sort(nbSortBy(sort));

      // assert
      expect(result[0]).toBe(datasource[30]);
    });
  });
});