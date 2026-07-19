import ISectionMapToStafConfig from "../types/ISectionMapToStafConfig";
import { LINE_SEPARATOR } from "../sections/ovdToStaf/consts";
import RecursiveKeyOf from "../../helpers/types/RecursiveKeyOf";

export default function convertOvdToStafObject<T, U>(
  data: T[],
  sectionConfig: ISectionMapToStafConfig<U, T>,
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
      if ("fixedValue" in cfg && cfg.fixedValue) {
        line[idx] = cfg["fixedValue"];
      } else if ("source" in cfg) {
        if ("mapper" in cfg && cfg.mapper) {
          const val = getNestedValue(row, cfg.source);
          const valMapped = cfg.mapper(val as string | number, row);
          if (valMapped !== undefined) line[idx] = valMapped;
        } else {
          if (cfg.source !== undefined)
            line[idx] = convertToStafString(getNestedValue(row, cfg.source));
        }
      }
    });

    linesArray[idx + 2] = line.join("\t");
  });

  return linesArray.join(LINE_SEPARATOR);
}

const STAF_UNDEFINED = "-";

export function getNestedValue<T>(
  obj: T,
  key: RecursiveKeyOf<T>,
): string | number | undefined {
  if (key.indexOf(".") < 0) {
    return (obj as any)[key];
  } else {
    const subKeyParts = key.split(".");
    const firstSubKey = subKeyParts.shift();

    if (firstSubKey === undefined) return undefined;

    let subObj = (obj as any)[firstSubKey];
    if (subObj === undefined) return STAF_UNDEFINED;

    return getNestedValue(subObj, subKeyParts.join("."));
  }
}

function convertToStafString(v: string | number | undefined) {
  // Number("") is 0, not NaN, so an empty string (e.g. a round-tripped field that was
  // "-" in the original STAF file and got parsed to "" via dashIsEmpty) must be treated
  // as missing here too, or it silently becomes the literal string "0" below.
  if (v === undefined || v === "") return STAF_UNDEFINED;

  const vAsNumber = Number(v);
  if (!isNaN(vAsNumber)) return vAsNumber.toString();

  return v.toString();
}
