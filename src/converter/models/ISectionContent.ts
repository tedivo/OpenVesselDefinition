export interface ISectionContent {
  name: string;
  headers: string[];
  data: Array<Array<string>>;
}

export type ISectionContentMap = Array<{ [name: string]: string }>;

export interface ISectionsByName {
  [name: string]: ISectionContentMap;
}
