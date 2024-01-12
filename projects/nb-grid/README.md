<div align="center">

![Neoburst logo](src/assets/neoburst-logo.png)

</div>

##### Introducing @neoburst/grid: Revolutionize Your Layouts

Welcome to **@neoburst/grid**, the game-changer in Angular grid components! Developed by Neoburst, this npm package introduces a responsive grid that empowers Angular developers to create dynamic layouts effortlessly.

#### Features

- **Grid Resizing:** Take control of your layout with the ability to resize grid items. Tailor your interface to fit your content, providing a truly personalized user experience.

- **Drag-Drop Functionality:** Reimagine your design process by enabling drag-and-drop functionality for grid items. Effortlessly reorder elements for a seamless and intuitive layout arrangement.

#### Getting Started

1. **Installation**: Install **@neoburst/grid** package via npm with the following command:

```npm
npm install @neoburst/grid
```

And include our predefined grid stylesheet in the root stylesheet of your project:

```scss
@import "@neoburst/grid";
```

2. **Creating a Responsive Grid**: Dive into our comprehensive documentation to effortlessly create a responsive grid in Angular. Learn how to define the layout, configure resizing options, and implement drag-and-drop features. Below you will find a quick setup for the nb-grid component:

```html
<!-- .html -->

<nb-grid [displayResizers]="true" (valueChange)="handleChange($event)">
  @for (tile of tiles; track tile.text) {
  <div [nbGridItem]="tile.gridItem" [nbGridItemDrag]="true">{{ tile.text }}</div>
  }
</nb-grid>
```

```typescript
// .ts

interface Tile {
  text: string;
  gridItem: NbGridItem;
}

tiles: Tile[] = [
  { text: 'One', gridItem: { cols: 1, rows: 1 } },
  { text: 'Two', gridItem: { cols: 1, rows: 1 } },
  { text: 'Three', gridItem: { cols: 1, rows: 1 } },
  { text: 'Four', gridItem: { cols: 1, rows: 1 } },
  { text: 'Five', gridItem: { cols: 1, rows: 1 } },
  { text: 'Six', gridItem: { cols: 1, rows: 1 } },
  { text: 'Seven', gridItem: { cols: 1, rows: 1 } },
  { text: 'Eight', gridItem: { cols: 1, rows: 1 } },
  { text: 'Nine', gridItem: { cols: 1, rows: 1 } },
  { text: 'Ten', gridItem: { cols: 1, rows: 1 } },
];

handleChange(gridItems: NbGridItem[]): void {
  console.log('gridItems', gridItems);
}
```

3. **Displaying Your Grid**: Showcase your responsive grid within Angular templates effortlessly. With our package, displaying dynamic layouts has never been more straightforward.

4. **Utilizing the Power**: Learn the ins and outs of leveraging a responsive grid in Angular. From beginners to seasoned developers, **@neoburst/grid** caters to all skill levels, offering a powerful and intuitive solution for your layout needs.

#### For All Angular Users

Whether you're just starting with Angular or you're a seasoned pro, **@neoburst/grid** brings a new level of flexibility to your layouts. Our packages ensure you're equipped with the tools needed to unlock the full potential of your Angular applications.

Ready to transform your layouts? Dive into the future with **@neoburst/grid**. Start today and experience a responsive grid like never before.

_Visit our documentation for in-depth guides, examples, and everything you need to get started on the path to effortless data visualization._
