import { Component, ElementRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'nb-label',
  templateUrl: './nb-label.component.html',
  styleUrls: ['./nb-label.component.scss']
})
export class NbLabelComponent {
  constructor (private _element: ElementRef<HTMLElement>) {
    this._element.nativeElement.classList.add('nb-label');
  }
}
