import { Component } from '@angular/core';
import { Person } from './services/people.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tableColumns: string[] = [...Object.keys(new Person()).map(x => x[0].toUpperCase().concat(x.substring(1))), 'Action'];
}
