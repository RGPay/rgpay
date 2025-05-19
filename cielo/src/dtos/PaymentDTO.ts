export interface PaymentItemDTO {
  name: string;
  quantity: number;
  sku: string;
  unitOfMeasure: string;
  unitPrice: number;
}

export interface PaymentDTO {
  accessToken: string;
  clientID: string;
  email: string;
  installments: number;
  items: PaymentItemDTO[];
  paymentCode:
    | 'CREDITO_AVISTA'
    | 'CREDITO_PARCELADO'
    | 'DEBITO'
    | 'VOUCHER'
    | 'PIX'
    | 'DINHEIRO'
    | 'CARTAO_LOJA'
    | 'PAGTO_FATURA'
    | 'FROTAS'
    | string;
  value: string;
}

export interface PaymentResponseDTO {
  success: boolean;
  code: string;
  result: any;
}
