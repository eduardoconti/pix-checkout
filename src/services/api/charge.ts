import { api, ApiErrorResponse } from '@/services/api/api';
type CreateChargeRequestData = {
  debtor: {
    name: string;
    cpf: string;
  };
  amount: number;
  merchant: {
    postal_code: string;
    city: string;
    name: string;
    category_code: string;
  };
  expiration: number;
};

export async function createCharge(data: CreateChargeRequestData) {
  try {
    const result = await api.post(`/immediate-charge`, data);
    console.log(result);
  } catch (error: any) {
    if (error?.response?.data) {
      const response = new ApiErrorResponse();
      Object.assign(response, error.response.data);
      throw response;
    }
    throw new Error(error?.message ?? 'Internal server error');
  } finally {
  }
}
