export default function sortRowsArray(
  a: `${number}${number}`,
  b: `${number}${number}`
): number {
  const aV = Number(a),
    bV = Number(b);
  const aN = aV % 2 === 1 ? aV : -aV;
  const bN = bV % 2 === 1 ? bV : -bV;
  return aN - bN;
}
