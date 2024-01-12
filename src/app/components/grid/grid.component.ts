import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbGridComponent, NbGridItem, NbGridItemDirective } from 'projects/nb-grid/src/public-api';
import { GridTileComponent } from './grid-tile/grid-tile.component';

interface Tile {
  color: string;
  text: string;
  gridItem: NbGridItem;
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, GridTileComponent, NbGridComponent, NbGridItemDirective],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  gridItem = { cols: 2, rows: 1 };

  tiles: Tile[] = [
    { text: 'One', color: 'lightblue' },
    { text: 'Two', color: 'lightgreen' },
    { text: 'Three', color: 'lightpink' },
    { text: 'Four', color: '#DDBDF1' },
    { text: 'Five', color: 'lightblue' },
    { text: 'Six', color: 'lightgreen' },
    { text: 'Seven', color: 'lightpink' },
    { text: 'Eight', color: '#DDBDF1' },
    { text: 'Nine', color: 'lightblue' },
    { text: 'Ten', color: 'lightgreen' },
    { text: 'Eleven', color: 'lightpink' },
    { text: 'Twelve', color: '#DDBDF1' },
    { text: 'Thirteen', color: 'lightblue' },
    { text: 'Fourteen', color: 'lightgreen' },
    { text: 'Fifteen', color: 'lightpink' },
    { text: 'Sixteen', color: '#DDBDF1' },
    { text: 'Seventeen', color: 'lightblue' },
    { text: 'Eighteen', color: 'lightgreen' },
    { text: 'Nineteen', color: 'lightpink' },
    { text: 'Twenty', color: '#DDBDF1' },
    { text: 'Twenty-one', color: 'lightblue' },
    { text: 'Twenty-two', color: 'lightgreen' },
    { text: 'Twenty-three', color: 'lightpink' },
    { text: 'Twenty-four', color: '#DDBDF1' },
    { text: 'Twenty-five', color: 'lightblue' },
    { text: 'Twenty-six', color: 'lightgreen' },
    { text: 'Twenty-seven', color: 'lightpink' },
    { text: 'Twenty-eight', color: '#DDBDF1' },
    { text: 'Twenty-nine', color: 'lightblue' },
    { text: 'Thirty', color: 'lightgreen' },
    { text: 'Thirty-one', color: 'lightpink' },
  ].map((tile) => this._addGridItem(tile));

  handleChange(gridItems: NbGridItem[]): void {
    console.log('gridItems', gridItems);
  }

  private _addGridItem(tile: Partial<Tile>): Tile {
    const gridItem: NbGridItem = {
      cols: /** Math.floor(Math.random() * 3) + */ 1,
      rows: /** Math.floor(Math.random() * 3) + */ 1
    };

    return { ...tile, gridItem } as Tile;
  }
}
