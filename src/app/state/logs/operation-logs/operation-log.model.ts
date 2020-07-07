import { ID } from '@datorama/akita';

export interface OperationLog {
  id: ID;
  user_name: string;
  ip: string;
  timestamp: string;
  method: string;
  url: string;
  // payload: string;
}
