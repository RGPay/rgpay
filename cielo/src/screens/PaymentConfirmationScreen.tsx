import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Button from '../components/Button';
import {PaymentResponseDTO} from '../dtos/PaymentDTO';

interface PaymentConfirmationScreenProps {
  route: {
    params: {
      orderId: number;
      paymentResult: PaymentResponseDTO;
    };
  };
  navigation: any; // We'll properly type this when we set up React Navigation
}

const PaymentConfirmationScreen: React.FC<PaymentConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const {orderId, paymentResult} = route.params;
  const [printing, setPrinting] = useState(false);

  const isSuccess = paymentResult.success;

  const handlePrintReceipt = async () => {
    try {
      setPrinting(true);
      // In a real app, we would call a method to print the receipt
      // For now, we'll just show an alert

      Alert.alert(
        'Impressão',
        'Funcionalidade de impressão será implementada com a SDK da Cielo LIO.',
        [{text: 'OK'}],
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível imprimir o recibo.');
      console.error('Print error:', error);
    } finally {
      setPrinting(false);
    }
  };

  const handleNewOrder = () => {
    // Navigate back to the menu screen
    navigation.navigate('Menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isSuccess ? 'Pagamento Confirmado' : 'Pagamento Não Realizado'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.statusCard,
            isSuccess ? styles.successCard : styles.errorCard,
          ]}>
          <Text style={styles.statusText}>
            {isSuccess
              ? 'Sua transação foi processada com sucesso!'
              : 'Houve um problema com sua transação.'}
          </Text>

          {isSuccess && (
            <Text style={styles.orderNumber}>Pedido #{orderId}</Text>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Detalhes da Transação</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>
              {isSuccess ? 'Aprovado' : 'Recusado'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Código:</Text>
            <Text style={styles.detailValue}>{paymentResult.code}</Text>
          </View>

          {paymentResult.result && typeof paymentResult.result === 'object' && (
            <>
              {paymentResult.result.authorization_code && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Autorização:</Text>
                  <Text style={styles.detailValue}>
                    {paymentResult.result.authorization_code}
                  </Text>
                </View>
              )}

              {paymentResult.result.card && paymentResult.result.card.brand && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bandeira:</Text>
                  <Text style={styles.detailValue}>
                    {paymentResult.result.card.brand}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isSuccess && (
          <Button
            title="Imprimir Comprovante"
            onPress={handlePrintReceipt}
            isLoading={printing}
            style={styles.footerButton}
          />
        )}

        <Button
          title={isSuccess ? 'Novo Pedido' : 'Tentar Novamente'}
          onPress={handleNewOrder}
          variant={isSuccess ? 'primary' : 'secondary'}
          style={styles.footerButton}
        />
      </View>
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#E6F7E6',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerButton: {
    marginBottom: 8,
  },
});

export default PaymentConfirmationScreen;
