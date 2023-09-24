export function findKey<T extends Object, K extends keyof T>(obj: T, key: string): K | undefined {
  return Object.keys(obj).find((k) => k.toLowerCase() === key.toLowerCase()) as K | undefined;
}