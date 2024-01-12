import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { NbTableComponent } from './nb-table.component';
import { NbTableService } from './nb-table.service';
import { QueryList, TemplateRef, signal } from '@angular/core';
import { NbTableDirective, NbColumnHeaderDirective } from './nb-table-directives/nb-table.directive';
import { of } from 'rxjs';

function getHeaderDirective(column: string): NbColumnHeaderDirective {
  const dir = new NbColumnHeaderDirective(<TemplateRef<any>>{});
  dir.column = column;

  return dir;
}

describe('NbTableComponent', () => {
  let component: NbTableComponent<any>;
  let fixture: ComponentFixture<NbTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NbTableComponent],
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

  describe('selected headers', () => {
    beforeEach(() => {
      // arrange
      const queryList = new QueryList<NbTableDirective>();
      queryList.reset([
        getHeaderDirective('FirstName'),
        getHeaderDirective('LastName'),
        getHeaderDirective('Age'),
        getHeaderDirective('Height'),
        getHeaderDirective('Gender'),
      ]);
      component.cells = queryList;
    });

    it('should rearrange columns when header is selected', () => {
      // act
      component.drop({ dataTransfer: { getData: () => 'Age', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);
      const selectedHeaders = component.selectedHeaders;
      const result = component.columnHeaders;

      // Assert
      expect(selectedHeaders).toStrictEqual(['Age']);
      expect(result.map((c) => c.column)).toStrictEqual(['Age', 'FirstName', 'LastName', 'Height', 'Gender']);
    });

    it('should rearrange columns back to original state when removing last selected header', () => {
      // act
      component.drop({ dataTransfer: { getData: () => 'Age', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);
      const selectedHeaders = component.selectedHeaders;
      const result1 = component.columnHeaders;

      // Assert
      expect(selectedHeaders).toStrictEqual(['Age']);
      expect(result1.map((c) => c.column)).toStrictEqual(['Age', 'FirstName', 'LastName', 'Height', 'Gender']);

      // act
      component.removeHeader(0);
      const noHeaders = component.selectedHeaders;
      const result2 = component.columnHeaders;

      // Assert
      expect(noHeaders).toStrictEqual([]);
      expect(result2.map((c) => c.column)).toStrictEqual(['FirstName', 'LastName', 'Age', 'Height', 'Gender']);
    });

    it('should rearrange selected headers', fakeAsync(() => {
      // arrange
      component.drop({ dataTransfer: { getData: () => 'Age', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);

      component.drop({ dataTransfer: { getData: () => 'Gender', effectAllowed: 'link' }, preventDefault: () => { }, target: { classList: { remove: () => { } } } } as unknown as DragEvent);

      const initialSelected = component.selectedHeaders;
      const initialHeaders = component.columnHeaders;
      expect(initialSelected).toStrictEqual(['Age', 'Gender']);
      expect(initialHeaders.map((c) => c.column)).toStrictEqual(['Age', 'Gender', 'FirstName', 'LastName', 'Height']);

      // act
      component.onDrag(<DragEvent>{}, 'Gender', 1);
      component.rearrangeHeaders(<DragEvent>{ dataTransfer: { effectAllowed: 'move' } }, 0);
      tick(200);
      const rearrangedSelected = component.selectedHeaders;
      const rearrangedHeaders = component.columnHeaders;
      flush();

      // assert
      expect(rearrangedSelected).toStrictEqual(['Gender', 'Age']);
      expect(rearrangedHeaders.map((c) => c.column)).toStrictEqual(['Gender', 'Age', 'FirstName', 'LastName', 'Height']);
    }));
  });
});
