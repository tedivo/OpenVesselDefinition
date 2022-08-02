export function stringIsTierOrStafNumber(
  s: string,
  forceEven = false
): boolean {
  const asNumber = Number(s);

  if (isNaN(asNumber)) return false;

  if (asNumber !== Math.floor(asNumber)) return false;

  if (forceEven) {
    return asNumber >= 0 && asNumber <= 120 && asNumber % 2 === 0;
  }

  return asNumber >= 0 && asNumber <= 99;
}
