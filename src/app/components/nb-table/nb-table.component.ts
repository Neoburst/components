import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NbSort } from 'projects/nb-table/src/lib/nb-table-components/nb-table-sort/nb-table-sort.component';
import { Observable } from 'rxjs';
import { Timer } from 'src/app/helper/timer';
import {
  Datasource,
  PeopleService,
  Person,
} from 'src/app/services/people.service';

@Component({
  selector: 'app-nb-table',
  templateUrl: './nb-table.component.html',
  styleUrls: ['./nb-table.component.scss'],
  providers: [PeopleService],
})
export class NbTableComponent implements OnInit, AfterViewInit {
  @Input() columns!: string[];

  datasource$!: Observable<Datasource<Person>>;
  expandedRow: number | undefined = undefined;

  private _timer!: Timer;

  constructor (private _peopleService: PeopleService) { }

  ngOnInit(): void {
    this.datasource$ = this._peopleService.getPeople$(25);
  }

  ngDoCheck(): void {
    this._timer = new Timer('nb-table');
  }

  ngAfterViewInit(): void {
    this._timer.stop();
  }

  clickRow(row: any): void {
    console.log('Clicked', row);
  }

  toggleRow(row: number): void {
    if (this.expandedRow == null || this.expandedRow !== row) this.expandedRow = row;
    else this.expandedRow = undefined;
  }

  sortByColumns(sorts: Array<NbSort>): void {
    if (sorts?.length >= 1) this._peopleService.sortData(sorts);
  }
}
