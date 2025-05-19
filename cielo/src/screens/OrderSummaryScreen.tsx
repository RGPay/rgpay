import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Button from '../components/Button';
import {OrderDTO, OrderItemDTO} from '../dtos/OrderDTO';
import ApiService from '../services/Api';
import CieloService from '../services/Cielo';

// For now, we'll use fixed IDs for testing
const TEST_UNIT_ID = 1;
const TEST_MAQUINETA_ID = 1;

interface OrderSummaryScreenProps {
  route: {
    params: {
      cartItems: OrderItemDTO[];
    };
  };
  navigation: any; // We'll properly type this when we set up React Navigation
}

const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({
  route,
  navigation,
}) => {
  const {cartItems} = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedPaymentCode, setSelectedPaymentCode] =
    useState('DEBITO_AVISTA');

  // Payment type options
  const paymentOptions = [
    {code: 'CREDITO_AVISTA', label: 'Crédito à vista'},
    {code: 'CREDITO_PARCELADO', label: 'Crédito parcelado'},
    {code: 'DEBITO_AVISTA', label: 'Débito'},
    {code: 'PIX', label: 'PIX'},
  ];

  const getTotalValue = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantidade * item.preco_unitario,
      0,
    );
  };

  const handleRemoveItem = (_productId: number) => {
    // We would update the cart items in a real app
    // For now, we'll just show an alert
    Alert.alert(
      'Remover Item',
      'Funcionalidade não implementada. Em um app real, o item seria removido do carrinho.',
      [{text: 'OK'}],
    );
  };

  const handleUpdateQuantity = (_productId: number, _newQuantity: number) => {
    // We would update the cart items in a real app
    // For now, we'll just show an alert
    Alert.alert(
      'Atualizar Quantidade',
      'Funcionalidade não implementada. Em um app real, a quantidade seria atualizada.',
      [{text: 'OK'}],
    );
  };

  const handleFinishOrder = async () => {
    try {
      setLoading(true);

      // Create order object
      const order: OrderDTO = {
        valor_total: getTotalValue(),
        id_maquineta: TEST_MAQUINETA_ID,
        id_unidade: TEST_UNIT_ID,
        items: cartItems,
      };

      // Save order to backend
      const savedOrder = await ApiService.createOrder(order);

      // Process payment with Cielo LIO
      const cieloService = new CieloService();
      const paymentResult = await cieloService.processPayment(
        order,
        selectedPaymentCode,
      );

      // Navigate to confirmation screen with results
      navigation.navigate('PaymentConfirmation', {
        orderId: savedOrder.id_pedido,
        paymentResult,
      });
    } catch (error) {
      Alert.alert(
        'Erro ao finalizar pedido',
        'Não foi possível processar o pedido. Tente novamente.',
      );
      console.error('Error finishing order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render a cart item
  const renderCartItem = ({item}: {item: OrderItemDTO}) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nome_produto}</Text>
        <Text style={styles.itemPrice}>
          R${' '}
          {(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() =>
            handleUpdateQuantity(item.id_produto, item.quantidade - 1)
          }
          disabled={item.quantidade <= 1}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantidade}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() =>
            handleUpdateQuantity(item.id_produto, item.quantidade + 1)
          }>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id_produto)}>
          <Text style={styles.removeButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo do Pedido</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id_produto.toString()}
        contentContainerStyle={styles.cartList}
        ListEmptyComponent={
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Carrinho vazio</Text>
            <Button
              title="Voltar ao Cardápio"
              onPress={() => navigation.goBack()}
            />
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.paymentSelection}>
            <Text style={styles.paymentTitle}>Forma de Pagamento:</Text>
            <View style={styles.paymentOptions}>
              {paymentOptions.map(option => (
                <TouchableOpacity
                  key={option.code}
                  style={[
                    styles.paymentOption,
                    selectedPaymentCode === option.code &&
                      styles.selectedPaymentOption,
                  ]}
                  onPress={() => setSelectedPaymentCode(option.code)}>
                  <Text
                    style={[
                      styles.paymentOptionText,
                      selectedPaymentCode === option.code &&
                        styles.selectedPaymentOptionText,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              R$ {getTotalValue().toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <Button
            title="Finalizar Pedido"
            onPress={handleFinishOrder}
            isLoading={loading}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3399FF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 'auto',
  },
  removeButtonText: {
    color: '#FF3333',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  paymentSelection: {
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPaymentOption: {
    borderColor: '#3399FF',
    backgroundColor: '#F0F8FF',
  },
  paymentOptionText: {
    color: '#666666',
  },
  selectedPaymentOptionText: {
    color: '#3399FF',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3399FF',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 16,
  },
});

export default OrderSummaryScreen;
