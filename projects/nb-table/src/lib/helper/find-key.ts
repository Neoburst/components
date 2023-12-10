/**
 * @license
 * Copyright Neoburst All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file in the root of the source tree.
 */

/**
 * Finds a key in an object, ignoring case.
 * @param obj The object to search.
 * @param key The key to find.
 * @returns The key if found, otherwise undefined.
 */
export function findKey<T extends Object, K extends keyof T>(obj: T, key: string): K | undefined {
  return Object.keys(obj).find((k) => k.toLowerCase() === key.toLowerCase()) as K | undefined;
}