export class Timer {
  readonly start = performance.now();

  constructor (private readonly name: string) { }

  stop(): void {
    const time = performance.now() - this.start;
    console.log('Timer:', this.name, 'finished rendering in', Math.round(time), 'ms');
  }
}