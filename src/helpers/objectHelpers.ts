export function cloneObject<T>(obj: undefined): undefined;
export function cloneObject<T>(obj: T): T;
export function cloneObject<T>(obj: T | undefined): T | undefined {
  if (obj === undefined) return undefined;

  if ("structuredClone" in globalThis) {
    return globalThis.structuredClone(obj);
  }

  return JSON.parse(JSON.stringify(obj));
}
