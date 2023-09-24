import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'nb-icon',
  templateUrl: './nb-icon.component.html',
  styleUrls: ['./nb-icon.component.scss']
})
export class NbIconComponent {
  private _icon!: string;

  @Input({ required: true }) set icon(id: string) {
    this._icon = `#${id}`;
  }

  get icon(): string {
    return this._icon;
  }

  @Input() color?: string;
  @Input() size?: string;
  @Input() strokeWidth?: number;
}
