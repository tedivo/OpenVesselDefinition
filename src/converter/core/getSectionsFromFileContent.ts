import { ISectionContent } from "../models/ISectionContent";

/**
 * Gets the content of a file and parses it (string operations)
 * @param fileContent string
 * @returns Array of ISectionContent
 */
export default function getSectionsFromFileContent(
  fileContent: string
): Array<ISectionContent> {
  const lines = fileContent.split(/\n|\r/).filter(Boolean);
  const sections: Array<ISectionContent> = [];

  let name: string;
  let dataLines: Array<Array<string>>;
  let sect: ISectionContent;

  lines.forEach((line) => {
    //Section and Headers
    if (line.charAt(0) === "*") {
      if (line.charAt(1) !== "*") {
        //Section
        name = line.slice(1);
        dataLines = [];
        sect = {
          name,
          headers: [],
          data: dataLines,
        };
        sections.push(sect);
      } else {
        //Headers
        sect.headers = line
          .slice(2)
          .split(/\t/)
          .map((s) => s.trim().replace(/\s/g, "_"));
      }
    } else {
      //Data
      dataLines.push(line.split(/\t/));
    }
  });

  return sections;
}
