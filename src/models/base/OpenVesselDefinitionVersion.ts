export default interface OpenVesselDefinitionVersion {
  $schema: string;
  $schemaId: "OpenVesselDefinition" | "IOpenVesselDefinitionV1";
  version: TVersion;
}

type TVersion = `${TMajorVersion}.${VNumber}.${VNumber}`;
type TMajorVersion = "1";
type VNumber = `${number}` | `${number}${number}`;
