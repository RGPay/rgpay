import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import {ProductDTO} from '../dtos/ProductDTO';
import {OrderItemDTO} from '../dtos/OrderDTO';
import ApiService from '../services/Api';

// For now, we'll use a fixed unit ID for testing
const TEST_UNIT_ID = 1;

interface MenuScreenProps {
  navigation: any; // We'll properly type this when we set up React Navigation
}

const MenuScreen: React.FC<MenuScreenProps> = ({navigation}) => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [cartItems, setCartItems] = useState<OrderItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await ApiService.getProducts(TEST_UNIT_ID);
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Não foi possível carregar os produtos. Tente novamente.');

      // Temporary fallback for testing (remove in production)
      setProducts([
        {
          id_produto: 1,
          nome: 'Produto Teste 1',
          preco: 10.5,
          categoria: 'Categoria 1',
          disponivel: true,
          id_unidade: TEST_UNIT_ID,
        },
        {
          id_produto: 2,
          nome: 'Produto Teste 2',
          preco: 15.99,
          categoria: 'Categoria 2',
          disponivel: true,
          id_unidade: TEST_UNIT_ID,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: ProductDTO) => {
    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(
      item => item.id_produto === product.id_produto,
    );

    if (existingItemIndex >= 0) {
      // Product already in cart, increment quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantidade += 1;
      setCartItems(updatedItems);
    } else {
      // Add new product to cart
      setCartItems([
        ...cartItems,
        {
          id_produto: product.id_produto,
          quantidade: 1,
          preco_unitario: product.preco,
          nome_produto: product.nome,
        },
      ]);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  const getTotalValue = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantidade * item.preco_unitario,
      0,
    );
  };

  const handleViewCart = () => {
    // Navigate to cart/order summary screen
    navigation.navigate('OrderSummary', {cartItems});
  };

  // Render a product item
  const renderProductItem = ({item}: {item: ProductDTO}) => (
    <ProductCard product={item} onAddToCart={handleAddToCart} />
  );

  // Show loading indicator
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3399FF" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  // Show error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar novamente" onPress={loadProducts} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cardápio</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id_produto.toString()}
        contentContainerStyle={styles.productList}
      />

      {cartItems.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
            </Text>
            <Text style={styles.cartTotal}>
              R$ {getTotalValue().toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <Button title="Ver Pedido" onPress={handleViewCart} />
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
  productList: {
    padding: 16,
  },
  cartSummary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  cartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartText: {
    fontSize: 16,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3399FF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#FF3333',
    textAlign: 'center',
  },
});

export default MenuScreen;
