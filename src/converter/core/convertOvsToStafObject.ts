import ISectionMapToStafConfig from "../types/ISectionMapToStafConfig";

export default function convertOvsToStafObject<T>(
  data: T[],
  sectionConfig: ISectionMapToStafConfig<T>
): string {
  const linesArray = new Array(data.length + 1);
  const mapVarsLenght = sectionConfig.mapVars.length;

  // 1. Add Headers
  const headers: string[] = new Array(mapVarsLenght);

  sectionConfig.mapVars.forEach(({ stafVar }, idx) => {
    headers[idx] = stafVar;
  });

  linesArray[0] = headers.join("\t");

  // 2. Add Data
  data.forEach((d, idx) => {
    const line: string[] = new Array(mapVarsLenght);

    //LOGIC HERE

    linesArray[idx + 1] = line.join("\t");
  });

  return linesArray.join("\n");
}
