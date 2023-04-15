import * as React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { parseCookies, setCookie } from 'nookies';
import { getAPIClient } from '@/services/api/axios';
import { CreateChargeRequestData } from '@/services/api/charge';
import { useCheckout } from '@/context/checkout-context';
import Checkout from '@/components/checkout/checkout';

export default function Home({
  fakeDto,
  fakeCashback,
  authError,
}: {
  fakeDto: CreateChargeRequestData;
  fakeCashback: number;
  authError: any;
}) {
  const { setAlertInfo } = useCheckout();

  React.useEffect(() => {
    if (authError) {
      setAlertInfo({
        severity: 'error',
        detail: authError.detail,
        title: authError.title,
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Pix Payments Checkout</title>
      </Head>
      <Checkout fakeDto={fakeDto} fakeCashback={fakeCashback} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['checkout.nextauth.token']: token } = parseCookies(ctx);

  const api = getAPIClient(ctx);
  let authError = null;
  if (!token) {
    try {
      const {
        data: { access_token },
      } = await api.post(`/login`, {
        email: process.env.NEXT_PUBLIC_API_EMAIL as string,
        password: process.env.NEXT_PUBLIC_API_PASS as string,
      });

      setCookie(ctx, 'checkout.nextauth.token', access_token, {
        maxAge: 60 * 60 * 1,
      });
      api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
    } catch (error: any) {
      authError = error.response?.data;
    } finally {
    }
  }

  const mockCreateChargeDTO = {
    debtor: {
      name: 'Eduardo Conti',
      cpf: '50673646459',
    },
    amount: Math.floor(Math.random() * 99899 + 100),
    merchant: {
      postal_code: '86990000',
      city: 'Marialva',
      name: 'Eduardo Dev',
      category_code: '0000',
    },
    expiration: 3600,
  };

  return {
    props: {
      fakeDto: mockCreateChargeDTO,
      fakeCashback: Math.floor(Math.random() * 99) + 1,
      authError: authError,
    },
  };
};
