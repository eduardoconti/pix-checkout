import { CreateChargeResponseData } from '@/services/api/charge';
import { AlertColor } from '@mui/material';
import React, { PropsWithChildren, createContext, useContext } from 'react';

type CheckoutContextType = {
  checked: boolean;
  loading: boolean;
  alertInfo?: AlertInfo;
  pixResponse?: CreateChargeResponseData;
  step: number;
  setChecked: (checked: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAlertInfo: (alertInfo?: AlertInfo) => void;
  setPixResponse: (pixResponse: CreateChargeResponseData) => void;
  setStep: (step: number) => void;
};

type AlertInfo = {
  title: string;
  detail: string;
  severity: AlertColor;
};

const Context = createContext<CheckoutContextType | null>(null);

function CheckoutProvider({ children }: PropsWithChildren) {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alertInfo, setAlertInfo] = React.useState<{
    title: string;
    detail: string;
    severity: AlertColor;
  }>();
  const [pixResponse, setPixResponse] =
    React.useState<CreateChargeResponseData>();
  const [step, setStep] = React.useState(0);

  return (
    <Context.Provider
      value={{
        checked,
        loading,
        alertInfo,
        pixResponse,
        step,
        setChecked,
        setLoading,
        setAlertInfo,
        setPixResponse,
        setStep,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default CheckoutProvider;
export const useCheckout = () => useContext(Context) as CheckoutContextType;
