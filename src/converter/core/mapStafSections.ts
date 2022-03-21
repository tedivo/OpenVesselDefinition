import { ISectionContent, ISectionsByName } from "./getSectionsFromFileContent";

/**
 * Separates each Section and creates Objects using the header var names
 * @param sections Pre-processed by getSectionsFromFileContent
 * @returns Object
 */
export default function mapStafSections(sections: Array<ISectionContent>) {
  const sectionsByName: ISectionsByName = {};
  // For each section
  sections.forEach((section) => {
    // Iterate data rows
    const data: Array<{ [name: string]: string }> = [];
    section.data.forEach((row) => {
      // Create empty object
      const mappedData: { [name: string]: string } = {};
      // Iterate inside row
      section.headers.forEach((headerKey, index) => {
        if (headerKey) {
          const value = row[index];
          mappedData[headerKey] = value;
        }
      });
      // Add to data Array
      data.push(mappedData);
    });

    sectionsByName[section.name] = data;
  });
  return sectionsByName;
}
