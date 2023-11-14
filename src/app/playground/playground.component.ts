import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface NbComponent {
  name: string;
  route: string;
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  components: NbComponent[] = [
    { name: 'Input', route: 'input' },
    { name: 'Table', route: 'table' }
  ];

  activeComponent = signal('');

  constructor (private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    const currentRoute = this._determineCurrentRoute();

    const firstComponent = currentRoute || this.components[0].route;
    this.activeComponent.set(firstComponent);
    this._router.navigate([firstComponent], { relativeTo: this._route });
  }

  routeTo(route: string): void {
    this.activeComponent.set(route);
    this._router.navigate([route], { relativeTo: this._route });
  }

  private _determineCurrentRoute(): string | undefined {
    const urlParts = this._router.routerState.snapshot.url.split('/');
    return urlParts.pop();
  }
}
