import { Injectable } from '@angular/core';
import { nbSortBy } from 'projects/nb-table/src/lib/nb-table-components/nb-table-sort/nb-sort-functions';
import { NbSort } from 'projects/nb-table/src/lib/nb-table-components/nb-table-sort/nb-table-sort.component';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Datasource<T> {
  entities: T[];
  total: number;
}

export class Person {
  constructor (
    public age?: number,
    public name?: string,
    public surname?: string,
    public height?: number,
    public weight?: number,
    public city?: string,
    public country?: string
  ) { }
}

@Injectable()
export class PeopleService {
  private _currentPageSize: number = 25;
  private _datasource: Datasource<Person>;
  private _datasourceR$ = new ReplaySubject<Datasource<Person>>(1);

  constructor () {
    const entities = this._getPersonDatasource();
    this._datasource = { entities, total: entities.length };
    this._datasourceR$.next(this._datasource);
  }

  getPeople$(pageSize: number): Observable<Datasource<Person>> {
    this._currentPageSize = pageSize;
    return this._datasourceR$.asObservable().pipe(
      map(() => {
        const pagedEntities = this._datasource.entities.slice(0, pageSize);
        return { entities: pagedEntities, total: pagedEntities.length };
      })
    );
  }

  sortData(sorts: NbSort[]): void {
    const sortedData = this._datasource.entities
      .sort(nbSortBy(sorts))
      .slice(0, this._currentPageSize);

    this._datasourceR$.next({ entities: sortedData, total: sortedData.length });
  }

  private _getPersonDatasource(): Person[] {
    return [
      {
        name: 'Nathaniel',
        surname: 'Branch',
        city: 'Ipswich',
        country: 'Brazil',
        age: 41,
        height: 190,
        weight: 50,
      },
      {
        name: 'Iris',
        surname: 'Salazar',
        city: 'Chungju',
        country: 'Brazil',
        age: 82,
        height: 155,
        weight: 108,
      },
      {
        name: 'Jamalia',
        surname: 'Dillon',
        city: 'San Lorenzo Nuovo',
        country: 'France',
        age: 21,
        height: 182,
        weight: 118,
      },
      {
        name: 'Shana',
        surname: 'Mullen',
        city: 'Dublin',
        country: 'Brazil',
        age: 65,
        height: 177,
        weight: 51,
      },
      {
        name: 'Demetria',
        surname: 'Baxter',
        city: 'Olsztyn',
        country: 'Netherlands',
        age: 79,
        height: 167,
        weight: 98,
      },
      {
        name: 'Jacqueline',
        surname: 'Long',
        city: 'Radom',
        country: 'Sweden',
        age: 41,
        height: 175,
        weight: 90,
      },
      {
        name: 'Hollee',
        surname: 'Horton',
        city: 'Charlottetown',
        country: 'Netherlands',
        age: 63,
        height: 159,
        weight: 58,
      },
      {
        name: 'Elijah',
        surname: 'Blankenship',
        city: 'Sterling Heights',
        country: 'Colombia',
        age: 27,
        height: 165,
        weight: 108,
      },
      {
        name: 'David',
        surname: 'Cameron',
        city: 'Chillán',
        country: 'Turkey',
        age: 87,
        height: 156,
        weight: 81,
      },
      {
        name: 'Zelenia',
        surname: 'Guerra',
        city: 'Bolton',
        country: 'Indonesia',
        age: 90,
        height: 186,
        weight: 88,
      },
      {
        name: 'Marah',
        surname: 'Day',
        city: 'St. Veit an der Glan',
        country: 'New Zealand',
        age: 45,
        height: 185,
        weight: 66,
      },
      {
        name: 'Lesley',
        surname: 'Leblanc',
        city: 'Brodick',
        country: 'Indonesia',
        age: 51,
        height: 150,
        weight: 80,
      },
      {
        name: 'Dexter',
        surname: 'Mills',
        city: 'Hồ Chí Minh City',
        country: 'Sweden',
        age: 94,
        height: 197,
        weight: 50,
      },
      {
        name: 'Hall',
        surname: 'Wright',
        city: 'Linz',
        country: 'India',
        age: 69,
        height: 206,
        weight: 52,
      },
      {
        name: 'Ulric',
        surname: 'Mason',
        city: 'Gilgit',
        country: 'Pakistan',
        age: 20,
        height: 168,
        weight: 80,
      },
      {
        name: 'Vladimir',
        surname: 'Cantu',
        city: 'Geest-GŽrompont-Petit-RosiŽre',
        country: 'United Kingdom',
        age: 54,
        height: 158,
        weight: 118,
      },
      {
        name: 'Stephanie',
        surname: 'Fernandez',
        city: 'Beijing',
        country: 'Sweden',
        age: 23,
        height: 197,
        weight: 50,
      },
      {
        name: 'Aurora',
        surname: 'Stevenson',
        city: 'Pamplona',
        country: 'France',
        age: 58,
        height: 208,
        weight: 94,
      },
      {
        name: 'Fitzgerald',
        surname: 'Tate',
        city: 'Cartagena',
        country: 'South Korea',
        age: 41,
        height: 204,
        weight: 114,
      },
      {
        name: 'Signe',
        surname: 'Allison',
        city: 'Regina',
        country: 'Brazil',
        age: 82,
        height: 184,
        weight: 103,
      },
      {
        name: 'Ezra',
        surname: 'Conner',
        city: 'Halberstadt',
        country: 'Canada',
        age: 20,
        height: 206,
        weight: 73,
      },
      {
        name: 'Astra',
        surname: 'Munoz',
        city: 'Cork',
        country: 'Norway',
        age: 25,
        height: 173,
        weight: 113,
      },
      {
        name: 'Gloria',
        surname: 'Livingston',
        city: 'Clackmannan',
        country: 'Vietnam',
        age: 79,
        height: 204,
        weight: 104,
      },
      {
        name: 'Mollie',
        surname: 'Jackson',
        city: 'Langenburg',
        country: 'Pakistan',
        age: 40,
        height: 164,
        weight: 99,
      },
      {
        name: 'Dylan',
        surname: 'Morgan',
        city: 'Przemyśl',
        country: 'Chile',
        age: 90,
        height: 195,
        weight: 78,
      },
      {
        name: 'Inga',
        surname: 'Tucker',
        city: 'Ełk',
        country: 'United States',
        age: 53,
        height: 177,
        weight: 79,
      },
      {
        name: 'Jolie',
        surname: 'Cox',
        city: 'Lelystad',
        country: 'Mexico',
        age: 86,
        height: 157,
        weight: 87,
      },
      {
        name: 'Vaughan',
        surname: 'Orr',
        city: 'Dannevirke',
        country: 'Canada',
        age: 95,
        height: 193,
        weight: 88,
      },
      {
        name: 'Sage',
        surname: 'Taylor',
        city: 'Canberra',
        country: 'Netherlands',
        age: 82,
        height: 183,
        weight: 108,
      },
      {
        name: 'Kerry',
        surname: 'Dominguez',
        city: 'Mérida',
        country: 'Colombia',
        age: 31,
        height: 209,
        weight: 119,
      },
      {
        name: 'Rhona',
        surname: 'Dawson',
        city: 'Bregenz',
        country: 'Pakistan',
        age: 49,
        height: 210,
        weight: 69,
      },
      {
        name: 'Brent',
        surname: 'Rhodes',
        city: 'João Pessoa',
        country: 'Russian Federation',
        age: 95,
        height: 182,
        weight: 125,
      },
      {
        name: 'Wade',
        surname: 'Watkins',
        city: 'Nagar',
        country: 'India',
        age: 69,
        height: 208,
        weight: 111,
      },
      {
        name: 'Jerome',
        surname: 'Conley',
        city: 'Bagh',
        country: 'Australia',
        age: 59,
        height: 152,
        weight: 104,
      },
      {
        name: 'Seth',
        surname: 'Fuentes',
        city: 'St. Pölten',
        country: 'Turkey',
        age: 95,
        height: 204,
        weight: 55,
      },
      {
        name: 'Audrey',
        surname: 'Beard',
        city: 'Town of Yarmouth',
        country: 'South Korea',
        age: 64,
        height: 192,
        weight: 90,
      },
      {
        name: 'Indigo',
        surname: 'Rollins',
        city: 'Avesta',
        country: 'Colombia',
        age: 95,
        height: 156,
        weight: 104,
      },
      {
        name: 'Miriam',
        surname: 'Wood',
        city: 'Woerden',
        country: 'South Korea',
        age: 27,
        height: 167,
        weight: 62,
      },
      {
        name: 'Nicholas',
        surname: 'Booth',
        city: 'Hoorn',
        country: 'Peru',
        age: 85,
        height: 175,
        weight: 114,
      },
      {
        name: 'Ifeoma',
        surname: 'Rosales',
        city: 'Gijón',
        country: 'Chile',
        age: 29,
        height: 206,
        weight: 63,
      },
    ];
  }
}
