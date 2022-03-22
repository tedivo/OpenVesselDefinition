import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import mapStafSections from "./core/mapStafSections";

export default class StafToShipInfoData {
  constructor(fileContent: string) {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(fileContent)
    );
  }
}
