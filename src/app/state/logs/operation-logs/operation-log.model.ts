import { ID } from '@datorama/akita';

export interface OperationLog {
  id: ID;
  time: string;
  username: string;
  table: string;
  action: string;
  ipAddress: string;
  request: string;
  payload: string;
}
