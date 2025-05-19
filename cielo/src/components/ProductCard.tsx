import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {ProductDTO} from '../dtos/ProductDTO';

interface ProductCardProps extends TouchableOpacityProps {
  product: ProductDTO;
  onAddToCart?: (product: ProductDTO) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  ...rest
}) => {
  const handleAddToCart = () => {
    if (onAddToCart && product.disponivel) {
      onAddToCart(product);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !product.disponivel && styles.disabled]}
      disabled={!product.disponivel}
      {...rest}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nome}
        </Text>
        <Text style={styles.category}>{product.categoria}</Text>
        <Text style={styles.price}>
          {`R$ ${product.preco.toFixed(2).replace('.', ',')}`}
        </Text>

        {!product.disponivel && (
          <Text style={styles.unavailable}>Indisponível</Text>
        )}
      </View>

      {onAddToCart && product.disponivel && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3399FF',
  },
  unavailable: {
    fontSize: 14,
    color: '#FF3333',
    marginTop: 4,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3399FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProductCard;
