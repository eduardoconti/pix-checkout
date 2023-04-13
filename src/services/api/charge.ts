import { api, ApiErrorResponse } from '@/services/api/api';
export type CreateChargeRequestData = {
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

export type CreateChargeResponseData = {
  transaction_id: string;
  psp_transaction_id: number;
  status: string;
  amount: number;
  expiration: number;
  emv: string;
  qr_code: string;
  created_at: string;
  last_update: string;
};

export async function createCharge(
  request: CreateChargeRequestData,
): Promise<CreateChargeResponseData> {
  try {
    const { data } = await api.post<CreateChargeResponseData>(
      `/immediate-charge`,
      request,
    );
    return data;
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
