/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

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
