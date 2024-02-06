import fs from "fs";

export const enumsToImprove = [
  ["BayLevelEnum", "./src/models/base/enums/BayLevelEnum.ts"],
  ["ForeAftEnum", "./src/models/base/enums/ForeAftEnum.ts"],
  ["LcgReferenceEnum", "./src/models/base/enums/LcgReferenceEnum.ts"],
  ["PortStarboardEnum", "./src/models/base/enums/PortStarboardEnum.ts"],
  ["PositionFormatEnum", "./src/models/base/enums/PositionFormatEnum.ts"],
  [
    "RowWeightCalculationEnum",
    "./src/models/base/enums/RowWeightCalculationEnum.ts",
  ],
  ["ValuesSourceEnum", "./src/models/base/enums/ValuesSourceEnum.ts"],
  [
    "ValuesSourceRowTierEnum",
    "./src/models/base/enums/ValuesSourceRowTierEnum.ts",
  ],
];

export function commentEnumWithValues(
  enumName: string,
  path: string,
  initialComment: string
) {
  const data = fs.readFileSync(path, "utf8");

  const enumRegex = new RegExp(`(export )?enum ${enumName} {`, "g");
  const enumStartIndex = data.search(enumRegex);
  if (enumStartIndex === -1) {
    console.error(`Could not find enum ${enumName}`);
    return initialComment;
  }

  const enumEndIndex = data.indexOf("}", enumStartIndex);
  if (enumEndIndex === -1) {
    console.error(`Could not find end of enum ${enumName}`);
    return initialComment;
  }

  const enumValues = data.substring(enumStartIndex, enumEndIndex);
  const values = enumValues
    .split("\n")
    .slice(1, -1)
    .map((value) => value.trim().replace(/"/g, "").replace(/,$/, ""))
    .filter(Boolean);

  return `${initialComment}. ${values.join(", ")}`;
}
