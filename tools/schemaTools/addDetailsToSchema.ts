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
} catch (err) {
  console.error(err);
}
