import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbGridItem, NbGridItemDirective } from './directives/nb-grid-item.directive';

@Component({
  selector: 'nb-grid',
  standalone: true,
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: grid;
        gap: 1rem;
        grid-auto-flow: row dense;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        transition: 300ms;
      }
    `
  ],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbGridComponent {
  @ContentChildren(NbGridItemDirective) set gridElements(dirs: QueryList<NbGridItemDirective>) {
    dirs.changes.subscribe((changes) => console.log(changes));
    this._gridItems.set(dirs.map((gridElement) => gridElement.gridItem).filter((gridItem): gridItem is NbGridItem => !!gridItem));

    dirs.forEach((dir) => this._configureDrag(dir));
  }

  @Input() columns?: number;
  @Input() gap?: number;
  @Input() set displayResizers(displayResizers: boolean) {
    this._element.nativeElement.classList.toggle('active-resizers', displayResizers);
  }

  private _draggedElement = signal<HTMLElement | undefined>(undefined);

  @Output() valueChange = new EventEmitter<NbGridItem[]>();

  private _gridItems = signal<NbGridItem[]>([]);

  constructor (private _element: ElementRef<HTMLElement>) {
    this._element.nativeElement.classList.add('nb-grid');
  }

  private _configureDrag(dir: NbGridItemDirective): void {
    const element = dir.gridElement;
    element.draggable = true;

    element.ondragover = (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

      const dragEl = this._draggedElement();
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!dragEl || !target.classList.contains('nb-grid-item')) return;

      if (target && target !== dragEl) {
        const targetPosition = target.getBoundingClientRect();
        const switchPointX = targetPosition.left + targetPosition.width * 0.5;
        const switchPointY = targetPosition.top + targetPosition.height * 0.5;
        const next = e.clientY > switchPointY || e.clientX > switchPointX;

        this._element.nativeElement.insertBefore(dragEl, next && target.nextSibling || target);
      }
    };

    element.ondragend = (e) => {
      e.preventDefault();

      element.classList.remove('nb-grid-item-dragged');
    };

    element.ondragstart = (e) => {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.textContent || element.innerText);

        element.classList.add('nb-grid-item-dragged');
        this._draggedElement.set(element);
      }
    };
  }
}
