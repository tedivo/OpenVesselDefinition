import ISectionMapToStafConfig from "../types/ISectionMapToStafConfig";
import RecursiveKeyOf from "../../helpers/types/RecursiveKeyOf";

export default function convertOvsToStafObject<T, U>(
  data: T[],
  sectionConfig: ISectionMapToStafConfig<U, T>
): string {
  const linesArray = new Array(data.length + 2);
  const mapVarsLenght = sectionConfig.mapVars.length;

  // 0. Add Section name
  linesArray[0] = `*${sectionConfig.stafSection}`;

  // 1. Add Headers
  const headers: string[] = new Array(mapVarsLenght);

  sectionConfig.mapVars.forEach(({ stafVar }, idx) => {
    headers[idx] = stafVar;
  });

  linesArray[1] = `**${headers.join("\t")}`;

  // 2. Add Data
  data.forEach((row, idx) => {
    const line: string[] = new Array(mapVarsLenght);

    sectionConfig.mapVars.forEach((cfg, idx) => {
      if ("fixedValue" in cfg) {
        line[idx] = cfg.fixedValue;
      } else if ("source" in cfg) {
        if ("mapper" in cfg) {
          line[idx] = cfg.mapper(getNestedValue(row, cfg.source));
        } else {
          line[idx] = convertToStafString(getNestedValue(row, cfg.source));
        }
      }
    });

    linesArray[idx + 2] = line.join("\t");
  });

  return linesArray.join("\n");
}

const STAF_UNDEFINED = "-";

export function getNestedValue<T>(
  obj: T,
  key: RecursiveKeyOf<T>
): string | number | undefined {
  if (key.indexOf(".") < 0) {
    return (obj as any)[key];
  } else {
    const subKeyParts = key.split(".");
    const firstSubKey = subKeyParts.shift();

    let subObj = obj[firstSubKey];
    if (subObj === undefined) return STAF_UNDEFINED;

    return getNestedValue(subObj, subKeyParts.join("."));
  }
}

function convertToStafString(v: string | number | undefined) {
  if (v === undefined) return STAF_UNDEFINED;

  const vAsNumber = Number(v);
  if (!isNaN(vAsNumber)) return vAsNumber.toString();

  return v.toString();
}
