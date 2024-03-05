/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import {
  ChangeDetectionStrategy,
  Component,
  CreateEffectOptions,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Signal,
  contentChildren,
  effect,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbGridItem, NbGridItemDirective } from './directives/nb-grid-item.directive';
import { GridItemState, NbGridService } from './nb-grid.service';

const createEffect = <T>(signal: Signal<T>, callback: (value: T) => void, options?: CreateEffectOptions): void => {
  effect(() => {
    const value = signal();
    callback(value);
  }, options);
};

@Component({
  selector: 'nb-grid',
  standalone: true,
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: grid;
        gap: var(--gap, 1rem);
        grid-auto-flow: row dense;
        grid-template-columns: repeat(var(--cols, auto-fill), minmax(var(--min-item-width, 200px), 1fr));
        transition: 300ms;
      }
    `
  ],
  imports: [CommonModule],
  providers: [NbGridService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbGridComponent {
  @Input() set columns(cols: number) {
    this._element.nativeElement.style.setProperty('--cols', String(cols));
  }

  @Input() set gap(gap: number) {
    this._element.nativeElement.style.setProperty('--gap', `${gap}px`);
  }

  @Input() set minItemWidth(minItemWidth: number) {
    this._element.nativeElement.style.setProperty('--min-item-width', `${minItemWidth}px`);
  }

  @Input() set displayResizers(displayResizers: boolean) {
    this._element.nativeElement.classList.toggle('active-resizers', displayResizers);
  }

  gridElements = contentChildren(NbGridItemDirective);

  @Output() valueChange = new EventEmitter<NbGridItem[]>();

  private _draggedElement = signal<HTMLElement | undefined>(undefined);

  constructor (private _element: ElementRef<HTMLElement>, private _nbGridService: NbGridService) {
    this._element.nativeElement.classList.add('nb-grid');

    createEffect(this.gridElements, (dirs) => dirs.forEach((dir) => this._configureDrag(dir)));
    createEffect(this._nbGridService.gridItemState, this._handleStateChanges);
  }

  private _handleStateChanges = (gridItemState: GridItemState): void => {
    const gridItems = Array.from(this._element.nativeElement.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .map((el) => el.attributes.getNamedItem('nb-grid-item')?.value)
      .map((id) => id ? gridItemState[id] : undefined)
      .filter((item): item is NbGridItem => !!item);
    this.valueChange.emit(gridItems);
  };

  private _configureDrag(dir: NbGridItemDirective): void {
    const element = dir.gridElement;

    element.ondragover = this._getDragOverEvent();
    element.ondragend = this._getDragEndEvent(element);
    element.ondragstart = this._getDragStartEvent(element);
  }

  private _getDragOverEvent(): (e: DragEvent) => void {
    return (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

      const dragEl = this._draggedElement();
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (
        !dragEl ||
        !target.classList.contains('nb-grid-item') ||
        !dragEl.attributes.getNamedItem('draggable')?.value
      ) return;

      if (target && target !== dragEl) {
        const targetPosition = target.getBoundingClientRect();
        const switchPointX = targetPosition.left + targetPosition.width * 0.5;
        const switchPointY = targetPosition.top + targetPosition.height * 0.5;
        const next = e.clientY > switchPointY || e.clientX > switchPointX;

        this._element.nativeElement.insertBefore(dragEl, next && target.nextSibling || target);
      }
    };
  }

  private _getDragEndEvent(element: HTMLElement): (e: DragEvent) => void {
    return (e) => {
      e.preventDefault();
      element.classList.remove('nb-grid-item-dragged');

      const gridItems = this._getGridItems();
      this.valueChange.emit(gridItems);
    };
  }

  private _getDragStartEvent(element: HTMLElement): (e: DragEvent) => void {
    return (e) => {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.textContent || element.innerText);

        if (element.attributes.getNamedItem('draggable')?.value) element.classList.add('nb-grid-item-dragged');
        this._draggedElement.set(element);
      }
    };
  }

  private _getGridItems(): NbGridItem[] {
    return Array.from(this._element.nativeElement.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .map((el: HTMLElement) => el.attributes.getNamedItem('nb-grid-item')?.value)
      .map((id) => this._nbGridService.getItem(id))
      .filter((item): item is NbGridItem => !!item);
  }
}
