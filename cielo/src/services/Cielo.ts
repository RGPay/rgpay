import {NativeModules} from 'react-native';
import {
  PaymentDTO,
  PaymentResponseDTO,
  PaymentItemDTO,
} from '../dtos/PaymentDTO';
import {OrderDTO} from '../dtos/OrderDTO';
import {CIELO_ACCESS_TOKEN, CIELO_CLIENT_ID, CIELO_EMAIL} from '@env';

export class CieloService {
  private accessToken: string;
  private clientID: string;
  private email: string;

  constructor(
    accessToken: string = CIELO_ACCESS_TOKEN || 'change-your-access-token',
    clientID: string = CIELO_CLIENT_ID || 'change-your-client-id',
    email: string = CIELO_EMAIL || 'example@email.com',
  ) {
    this.accessToken = accessToken;
    this.clientID = clientID;
    this.email = email;
  }

  // Convert OrderDTO to PaymentDTO for Cielo LIO
  private mapOrderToPayment(
    order: OrderDTO,
    paymentCode: string = 'DEBITO_AVISTA',
  ): PaymentDTO {
    // Calculate total value from items
    const totalValue = order.items
      .reduce((sum, item) => sum + item.quantidade * item.preco_unitario, 0)
      .toFixed(2);

    // Map order items to payment items
    const paymentItems: PaymentItemDTO[] = order.items.map(item => ({
      name: item.nome_produto || `Produto ${item.id_produto}`,
      quantity: item.quantidade,
      sku: item.id_produto.toString(),
      unitOfMeasure: 'unidade',
      unitPrice: item.preco_unitario,
    }));

    return {
      accessToken: this.accessToken,
      clientID: this.clientID,
      email: this.email,
      installments: 0, // Default to no installments
      items: paymentItems,
      paymentCode,
      value: totalValue,
    };
  }

  // Process a payment with an order
  async processPayment(
    order: OrderDTO,
    paymentCode: string = 'DEBITO_AVISTA',
  ): Promise<PaymentResponseDTO> {
    const paymentData = this.mapOrderToPayment(order, paymentCode);
    return this.payment(paymentData);
  }

  // Basic payment function (kept for compatibility with original sample)
  async payment(paymentData?: PaymentDTO): Promise<PaymentResponseDTO> {
    // If no payment data is provided, use a default test payment
    const json = paymentData || {
      accessToken: this.accessToken,
      clientID: this.clientID,
      email: this.email,
      installments: 0,
      items: [
        {
          name: 'Teste',
          quantity: 1,
          sku: '1',
          unitOfMeasure: 'unidade',
          unitPrice: 10,
        },
      ],
      paymentCode: 'DEBITO_AVISTA',
      value: '10',
    };

    try {
      const response = await NativeModules.Payment.payment(
        JSON.stringify(json),
      );

      return {
        success: response.success,
        code: response.code,
        result: response.success
          ? JSON.parse(response.result)
          : response.result,
      };
    } catch (error: unknown) {
      console.error('Payment error:', error);
      return {
        success: false,
        code: 'ERROR',
        result:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export default CieloService;
