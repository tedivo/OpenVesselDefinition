import ISectionMapConfig, {
  IMappedVarConfig,
} from "../sections/ISectionMapConfig";
import { ISectionObject } from "./getSectionsFromFileContent";

function convertStafObjectToShipOpenSpec<T>(
  sectionArray: ISectionObject,
  sectionConfig: ISectionMapConfig<T>
): T[] {
  const rows: T[] = [];
  sectionArray.forEach((mappedObj) => {
    const baseObj = {};

    Object.keys(mappedObj).forEach((key) => {
      const MapConfigOfKey: IMappedVarConfig<T> = sectionConfig.mapVars[key];

      if (MapConfigOfKey) {
        const mappedKey = MapConfigOfKey.target;
        const mappedKeyParts = mappedKey.split(".");
        const lastKey = mappedKeyParts.pop();
        let baseObjRef = baseObj;

        // Iterate over parents of key to create container objects
        if (mappedKeyParts.length > 0) {
          mappedKeyParts.forEach((keyPart) => {
            if (baseObjRef[keyPart] === undefined) {
              baseObjRef[keyPart] = {};
            }
            baseObjRef = baseObjRef[keyPart];
          });
        }

        // Set value
        if (MapConfigOfKey.mapper) {
          baseObjRef[lastKey] = MapConfigOfKey.mapper(mappedObj[key]);
        } else {
          baseObjRef[lastKey] = mappedObj[key];
        }
      }
    });

    rows.push(baseObj as T);
  });

  return rows;
}

export default convertStafObjectToShipOpenSpec;
