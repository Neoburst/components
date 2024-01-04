import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid-tile.component.html',
  styleUrl: './grid-tile.component.scss'
})
export class GridTileComponent {
  number = Math.round(Math.random() * 100);
}
