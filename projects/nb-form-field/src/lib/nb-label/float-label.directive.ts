import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'nb-label[nbFloatLabel]'
})
export class FloatLabelDirective implements OnInit {

  constructor (private _element: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this._element.nativeElement.classList.add('nb-float-label');
  }
}
