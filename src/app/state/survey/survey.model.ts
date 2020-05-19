import { ID } from '@datorama/akita';

export interface Survey {
  id: ID;
  type: string;
  title: string;
  description: string;
  server: string;
  databaseTable: string;
}