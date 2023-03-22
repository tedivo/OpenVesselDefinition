export default interface OpenVesselDefinitionVersion {
  schema: "OpenVesselDefinition";
  version: TVersion;
}

type TVersion = `${TMajorVersion}.${VNumber}.${VNumber}`;
type TMajorVersion = "1";
type VNumber = `${number}` | `${number}${number}`;
