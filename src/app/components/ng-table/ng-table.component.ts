import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Timer } from 'src/app/helper/timer';
import {
  Datasource,
  PeopleService,
  Person,
} from 'src/app/services/people.service';

@Component({
  selector: 'app-ng-table',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.scss'],
  providers: [PeopleService],
})
export class NgTableComponent implements OnInit, AfterViewInit {
  @Input() columns!: string[];

  datasource$!: Observable<Datasource<Person>>;
  private _timer!: Timer;

  constructor (private _peopleService: PeopleService) { }

  ngDoCheck(): void {
    this._timer = new Timer('mat table');
  }

  ngOnInit(): void {
    this.datasource$ = this._peopleService.getPeople$(25);
  }

  ngAfterViewInit(): void {
    this._timer.stop();
  }

  clickRow(row: any): void {
    console.log('Clicked', row);
  }

  // sortByColumn(column: string): void {
  //   this._peopleService.sortData(column.toLowerCase());
  // }
}
