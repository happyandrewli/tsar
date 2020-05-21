import { ID } from '@datorama/akita';

export interface Series {
  id: ID;
  name: string;
  flag: string;
  naics: string;
  item: string;
  topic: string;
  subtopic: string;
  item_type: string;
  data_type: string;
  form: string;
  tbl: string;
  view: string;
  last_updated: string;
}

export interface DfResource {
  resource: Series[];
  meta: {
    count: number,
    schema: {
      field: {
        name: string;
        label: string;
        description: string;
        type: string;
      }[]
    }
  };
}
