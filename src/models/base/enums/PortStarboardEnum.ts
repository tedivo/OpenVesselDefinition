enum PortStarboardEnum {
  "PORT" = 1,
  "STARBOARD" = 2,
}

export default PortStarboardEnum;

export const getStafPortStarboardValue = (
  s: "PORT" | "STBD"
): PortStarboardEnum => {
  if (s === "PORT") return PortStarboardEnum.PORT;
  return PortStarboardEnum.STARBOARD;
};

export const getPortStarboardValueToStaf = (
  v: PortStarboardEnum
): "PORT" | "STBD" => {
  if (v === PortStarboardEnum.PORT) return "PORT";
  return "STBD";
};
