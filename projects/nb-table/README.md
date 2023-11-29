<style>
.title {
  border: 1px solid #000;
  border-radius: 60px;
  box-sizing: border-box;
  flex: 1;
  font-family: 'Unbounded', sans-serif;
  font-size: calc(25px + 4vw);
  font-weight: bold;
  height: auto;
  justify-content: center;
  line-height: 1.1em;
  margin: 0 10vw;
  max-width: 1000px;
  padding: 20px 60px;
  z-index: 1;
}
</style>

<div align="center">
  <div class="title">NEOBURST</div>
</div>

##### Introducing @neoburst/table: Your Angular Data Management Solution

Are you an Angular developer looking for an intuitive way to manage and display data tables in your applications? Look no further! We're excited to introduce the **@neoburst/table** npm package, brought to you by Neoburst. Whether you're a beginner or an experienced Angular user, our feature-packed table component is here to make data visualization a breeze.

#### Features

- **Effortless Data Management:** Creating tables in Angular has never been easier. With @neoburst/table, you can seamlessly integrate data from various sources such as arrays, observables or even signals, eliminating the hassle of manual data manipulation.

- **Interactive Sorting and Ordering:** Empower your users with the ability to sort and reorder table columns effortlessly. Our component provides an intuitive interface for dynamic data organization, enhancing the user experience.

- **Simplified Column Grouping:** Take control of your data presentation by grouping columns logically. Present related data together, giving users a comprehensive view of the information at hand.

- **Personalize with Ease:** Styling your table to align with your application's aesthetics is a breeze. Tailor the appearance of the table to match your design effortlessly, ensuring a seamless integration within your Angular project.

#### Getting Started

1. **Installation**: Install the **@neoburst/table** package via npm using the command:

```npm
npm install @neoburst/table
```

And include our predefined table stylesheet in to the root stylesheet of your project:

```scss
@import "@neoburst/table";
```

2. **Creating a Table:** Follow our intuitive documentation to create a table instance within your Angular application. Define your data structure, specify column attributes, and enable features like sorting and grouping with ease. Below you will find a quick setup for the nb-table component:

```html
<!-- .html -->

<nb-table [dataSource]="data">
  <ng-container *ngFor="let column of columns">
    <th *nbColumnHeader="column" [nbHeaderCell]="column">{{ column }}</th>

    <td *nbColumnCell="column; let dataItem = dataItem; let row = row" [nbCell]="column" [nbCellRow]="row">{{ dataItem[column] }}</td>
  </ng-container>

  <tr *nbHeaderRow></tr>
  <tr *nbRow nbTableRow (click)="clickRow($event)"></tr>
</nb-table>
```

```typescript
// .ts

interface Person {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
}

columns = ['id', 'name', 'age', 'height', 'weight'];
data: Array<Person> = [
  { id: 1, name: 'Harry', age: 30, height: 183, weight: 86 },
  { id: 2, name: 'Barry', age: 34, height: 186, weight: 76 },
  { id: 3, name: 'Larry', age: 63, height: 165, weight: 46 },
  { id: 4, name: 'Carry', age: 28, height: 168, weight: 63 },
  { id: 5, name: 'Perry', age: 30, height: 148, weight: 54 },
  { id: 6, name: 'Jerry', age: 58, height: 178, weight: 75 },
  { id: 7, name: 'Kerri', age: 38, height: 183, weight: 76 },
];

clickRow(event: any): void {
  console.log(event);
}
```

3. **Displaying the Table:** Displaying your table is a breeze. Incorporate the table component within your Angular templates, and let our package handle the heavy lifting of data rendering and interaction.

4. **HTML Table Integration:** Need to display your table as an HTML table? We've got you covered. Our package provides seamless integration options, allowing you to leverage your existing knowledge while benefiting from advanced data management capabilities.

#### For All Skill Levels

Whether you're diving into Angular development for the first time or you're a seasoned pro, **@neoburst/table** offers a seamless solution to your data visualization needs. Our mission is to empower you with tools that enhance your projects without causing confusion. The documentation and resources we provide are designed to ensure you have the guidance required to make the most out of our package. With a focus on clarity and simplicity, we're here to enable you to achieve your data management goals effortlessly.

So why wait? Elevate your Angular applications with the power of **@neoburst/table**. Get started today and unlock a new level of data management possibilities.

_Visit our documentation for in-depth guides, examples, and everything you need to get started on the path to effortless data visualization._
