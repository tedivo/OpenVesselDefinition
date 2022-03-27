export default interface OpenShipSpecVersion {
  schema: "OpenShipSpec";
  version: TVersion;
}

type TVersion = `${TMajorVersion}.${VNumber}.${VNumber}`;
type TMajorVersion = "1";
type VNumber = `${number}` | `${number}${number}`;
