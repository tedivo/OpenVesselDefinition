export const stafFileString = [
  "*SECTION1",
  ["**Header1a", "Header2a", "Header3a"].join("\t"),
  ["data1", "data2", "data3"].join("\t"),
  "*SECTION2",
  ["**Header1b", "Header2b", "Header3b"].join("\t"),
  ["data4", "data5", "data6"].join("\t"),
  ["data7", "data8", "data9"].join("\t"),
].join("\n");

export const stafFileStringProcessed = [
  {
    name: "SECTION1",
    headers: ["Header1a", "Header2a", "Header3a"],
    data: [["data1", "data2", "data3"]],
  },
  {
    name: "SECTION2",
    headers: ["Header1b", "Header2b", "Header3b"],
    data: [
      ["data4", "data5", "data6"],
      ["data7", "data8", "data9"],
    ],
  },
];
