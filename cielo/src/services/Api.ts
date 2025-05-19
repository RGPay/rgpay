import axios from 'axios';
import {ProductDTO} from '../dtos/ProductDTO';
import {OrderDTO} from '../dtos/OrderDTO';
import {API_URL} from '@env';

// API base URL from .env
const apiUrl = API_URL || 'http://your-backend-url.com/api';

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  // Get products by unit
  static async getProducts(unitId: number): Promise<ProductDTO[]> {
    try {
      const response = await api.get(`/produtos?unidade=${unitId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Create a new order
  static async createOrder(order: OrderDTO): Promise<OrderDTO> {
    try {
      const response = await api.post('/pedidos', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrder(orderId: number): Promise<OrderDTO> {
    try {
      const response = await api.get(`/pedidos/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

export default ApiService;
