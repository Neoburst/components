import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbSort, NbTableSortComponent } from './nb-table-sort.component';
import { NbTableService } from '../../nb-table.service';
import { NbIconComponent } from '../nb-icon/nb-icon.component';

describe('NbTableSortComponent', () => {
  let component: NbTableSortComponent;
  let fixture: ComponentFixture<NbTableSortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NbTableSortComponent],
      providers: [NbTableService],
      imports: [NbIconComponent]
    });
    fixture = TestBed.createComponent(NbTableSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set a new sort', () => {
    // arrange
    component.id = 'Age';

    // act
    component.setSort();
    const sort = component.activeSort();
    const icon = component.directionIcon();

    // assert
    expect(sort).toStrictEqual(<NbSort>{ column: 'Age', direction: 'asc' });
    expect(icon).toBe('arrow-up');
  });

  it('should set an existing sort to descending', () => {
    // arrange
    component.id = 'Age';
    component.setSort();
    fixture.detectChanges();

    // act
    component.setSort();
    const sort = component.activeSort();
    const icon = component.directionIcon();

    // assert
    expect(sort).toStrictEqual(<NbSort>{ column: 'Age', direction: 'desc' });
    expect(icon).toBe('arrow-down');
  });

  it('should clear existing descending sort', () => {
    // arrange
    component.id = 'Age';
    component.setSort('desc');
    fixture.detectChanges();

    // act
    component.setSort();
    const sort = component.activeSort();

    // assert
    expect(sort).toBeUndefined();
  });

  it('should have initial sort', () => {
    // arrange
    component.id = 'Age';
    component.start = 'desc';
    component.ngOnInit();

    // act
    const sort = component.activeSort();

    // assert
    expect(sort).toStrictEqual(<NbSort>{ column: 'Age', direction: 'desc' });
  });
});
