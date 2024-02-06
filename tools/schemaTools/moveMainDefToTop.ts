export function moveMainDefToTop(schema: any, mainDefinition: string) {
  const mainDefinitionSchema = schema.definitions[mainDefinition];

  if (!mainDefinitionSchema) {
    console.error(`Could not find main definition ${mainDefinition}`);
    return schema;
  }

  delete schema.definitions[mainDefinition];
  schema.definitions = {
    [mainDefinition]: mainDefinitionSchema,
    ...schema.definitions,
  };

  return schema;
}
