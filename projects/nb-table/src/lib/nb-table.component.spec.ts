import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { NbTableComponent } from './nb-table.component';
import { NbTableService } from './nb-table.service';
import { Component, ViewChild, signal } from '@angular/core';
import { NbColumnHeaderDirective } from './nb-table-directives/nb-table.directive';
import { of } from 'rxjs';
import { NbIconComponent } from './nb-table-components/nb-icon/nb-icon.component';


@Component({
  standalone: true,
  imports: [NbTableComponent, NbColumnHeaderDirective],
  template: `
    <nb-table>
      @for (column of columns; track column) {
        <th *nbColumnHeader="column">{{ column }}</th>
      }
    </nb-table>
  `
})
class TestTableComponent {
  @ViewChild(NbTableComponent, { static: false }) table!: NbTableComponent<any>;

  columns = ['FirstName', 'LastName', 'Age', 'Height', 'Gender'];
}

describe('NbTableComponent', () => {
  let component: NbTableComponent<any>;
  let fixture: ComponentFixture<NbTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NbTableComponent, NbIconComponent],
      providers: [
        {
          provide: NbTableService,
          useValue: <Partial<NbTableService<any>>>{
            columnTemplate: signal(''),
            dataSource: signal([]),
            setColumns: (cols: string[]) => { },
            setSelectedColumns: (cols: string[]) => { },
            setTableRows: () => { },
            stable$: of(true),
            tableSorts: signal([]),
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('selected headers', () => {
  let testComponent: TestTableComponent;
  let fixture: ComponentFixture<TestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TestTableComponent],
      providers: [NbTableService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestTableComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should rearrange columns when header is selected', () => {
    // act
    testComponent.table.drop({ dataTransfer: { getData: () => 'Age', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);
    const selectedHeaders = testComponent.table.selectedHeaders;
    const result = testComponent.table.columnHeaders;

    // Assert
    expect(selectedHeaders).toStrictEqual(['Age']);
    expect(result.map((c) => c.column)).toStrictEqual(['Age', 'FirstName', 'LastName', 'Height', 'Gender']);
  });

  it('should rearrange columns back to original state when removing last selected header', () => {
    // act
    testComponent.table.drop({ dataTransfer: { getData: () => 'Age', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);
    const selectedHeaders = testComponent.table.selectedHeaders;
    const result1 = testComponent.table.columnHeaders;

    // Assert
    expect(selectedHeaders).toStrictEqual(['Age']);
    expect(result1.map((c) => c.column)).toStrictEqual(['Age', 'FirstName', 'LastName', 'Height', 'Gender']);

    // act
    testComponent.table.removeHeader(0);
    const noHeaders = testComponent.table.selectedHeaders;
    const result2 = testComponent.table.columnHeaders;

    // Assert
    expect(noHeaders).toStrictEqual([]);
    expect(result2.map((c) => c.column)).toStrictEqual(['FirstName', 'LastName', 'Age', 'Height', 'Gender']);
  });

  it('should rearrange selected headers', fakeAsync(() => {
    // arrange
    testComponent.table.drop({ dataTransfer: { getData: () => 'Age', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);

    testComponent.table.drop({ dataTransfer: { getData: () => 'Gender', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);

    const initialSelected = testComponent.table.selectedHeaders;
    const initialHeaders = testComponent.table.columnHeaders;
    expect(initialSelected).toStrictEqual(['Age', 'Gender']);
    expect(initialHeaders.map((c) => c.column)).toStrictEqual(['Age', 'Gender', 'FirstName', 'LastName', 'Height']);

    // act
    testComponent.table.onDrag(<DragEvent>{}, 'Gender', 1);
    testComponent.table.rearrangeHeaders(<DragEvent>{ dataTransfer: { effectAllowed: 'move' } }, 0);
    tick(200);
    const rearrangedSelected = testComponent.table.selectedHeaders;
    const rearrangedHeaders = testComponent.table.columnHeaders;
    flush();

    // assert
    expect(rearrangedSelected).toStrictEqual(['Gender', 'Age']);
    expect(rearrangedHeaders.map((c) => c.column)).toStrictEqual(['Gender', 'Age', 'FirstName', 'LastName', 'Height']);
  }));
});
