enum LcgReferenceEnum {
  "MIDSHIPS" = 1,
  "AFT_PERPENDICULAR" = 2,
  "FWD_PERPENDICULAR" = 3,
}

export default LcgReferenceEnum;

export const getStafLcgReferenceEnumValue = (
  s: "MS" | "AP" | "FP"
): LcgReferenceEnum | undefined => {
  if (s === "MS") return LcgReferenceEnum.MIDSHIPS;
  if (s === "AP") return LcgReferenceEnum.AFT_PERPENDICULAR;
  if (s === "FP") return LcgReferenceEnum.FWD_PERPENDICULAR;
  return undefined;
};
