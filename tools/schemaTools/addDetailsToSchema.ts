import { commentEnumWithValues, enumsToImprove } from "./commentEnumWithValues";

import fs from "fs";
import { moveMainDefToTop } from "./moveMainDefToTop";

try {
  const args = process.argv.slice(2);

  const schemaString = fs.readFileSync(args[0], "utf8");
  const schema = JSON.parse(schemaString);

  // Comment enums with their values
  enumsToImprove.forEach(([enumName, path]) => {
    if (schema.definitions[enumName]) {
      const initialComment = schema.definitions[enumName].description || "";
      const newComment = commentEnumWithValues(enumName, path, initialComment);

      if (newComment) schema.definitions[enumName].description = newComment;
    }
  });

  // Move main definition to top
  const schemaModified = moveMainDefToTop(schema, "IOpenVesselDefinitionV1");

  fs.writeFileSync(args[0], JSON.stringify(schemaModified, null, 2));

  // B. Replace <!-- SCHEMA:START --> and <!-- SCHEMA:END --> with the schema
  const readmeString = fs.readFileSync("README.md", "utf8");
  const readmeStringModified = replaceSchemaInReadme(readmeString, schemaModified);
  fs.writeFileSync("README.md", readmeStringModified);
} catch (err) {
  console.error(err);
}

function replaceSchemaInReadme(readmeString: string, schemaString: string) {
  // Remove the existing schema between <!-- SCHEMA:START --> and <!-- SCHEMA:END -->
  const schemaStartIndex = readmeString.indexOf("<!-- SCHEMA:START -->");
  const schemaEndIndex = readmeString.indexOf("<!-- SCHEMA:END -->");
  const schema = readmeString.substring(schemaStartIndex, schemaEndIndex);
  readmeString = readmeString.replace(schema, "```json\n" + JSON.stringify(schemaString, null, 2) + "\n```");

  return readmeString;
}