import { getAPIClient } from '@/services/api/axios';

export const api = getAPIClient();

export class ApiErrorResponse {
  status!: number;
  title!: string;
  type!: string;
  detail?: string;
  invalidFields?: InvalidFields[];
}
type InvalidFields = {
  field: string;
  reason: string;
};
