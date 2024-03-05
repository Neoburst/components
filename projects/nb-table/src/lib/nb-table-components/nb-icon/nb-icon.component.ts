/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

import { Component, Input, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'nb-icon',
  templateUrl: './nb-icon.component.html',
  styleUrls: ['./nb-icon.component.scss']
})
export class NbIconComponent {
  private _iconId = input.required<string>({ alias: 'icon' });
  icon = computed(() => `#${this._iconId()}`);

  color = input<string | undefined>();
  size = input<string | undefined>();
  strokeWidth = input<number | undefined>();
}
