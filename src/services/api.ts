import apiClient from '../lib/axios';
import axios from 'axios';
import {
  AuthSuccessResponse,
  Category,
  Brand,
  SubCategory,
  Product,
  CartResponse,
  WishlistResponse,
  WishlistActionResponse,
  AddressesResponse,
  Order,
  PaginatedResponse,
  SingleResponse,
  ShippingAddressInput,
  CheckoutSessionResponse,
  ProductQueryParams,
  VerifyTokenResponse,
  Address,
} from '../types/api.types';

export type { ShippingAddressInput };

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  email: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface UpdateMeInput {
  name: string;
  email: string;
  phone: string;
}

export interface AddressInput {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export const authApi = {
  signup: async (data: SignupInput): Promise<AuthSuccessResponse> => {
    const res = await axios.post<AuthSuccessResponse>('/api/auth/register', data);
    return res.data;
  },

  signin: async (data: SigninInput): Promise<AuthSuccessResponse> => {
    const res = await axios.post<AuthSuccessResponse>('/api/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<{ status: string }> => {
    const res = await axios.post<{ status: string }>('/api/auth/logout');
    return res.data;
  },

  getSession: async (): Promise<{ user: AuthSuccessResponse['user'] | null }> => {
    const res = await axios.get<{ user: AuthSuccessResponse['user'] | null }>('/api/auth/session');
    return res.data;
  },

  forgotPassword: async (email: string): Promise<{ statusMsg?: string; message: string }> => {
    const res = await apiClient.post<{ statusMsg?: string; message: string }>('/auth/forgotPasswords', { email });
    return res.data;
  },

  verifyResetCode: async (resetCode: string): Promise<{ status: string }> => {
    const res = await apiClient.post<{ status: string }>('/auth/verifyResetCode', { resetCode });
    return res.data;
  },

  resetPassword: async (data: ResetPasswordInput): Promise<AuthSuccessResponse> => {
    const res = await apiClient.put<AuthSuccessResponse>('/auth/resetPassword', data);
    return res.data;
  },

  verifyToken: async (): Promise<VerifyTokenResponse> => {
    const res = await apiClient.get<VerifyTokenResponse>('/auth/verifyToken');
    return res.data;
  },

  changeMyPassword: async (data: ChangePasswordInput): Promise<{ message: string; token: string }> => {
    const res = await axios.put<{ message: string; token: string }>('/api/auth/change-password', data);
    return res.data;
  },

  updateMe: async (data: UpdateMeInput): Promise<{ message: string; user: { name: string; email: string; phone: string } }> => {
    const res = await apiClient.put<{ message: string; user: { name: string; email: string; phone: string } }>('/users/updateMe/', data);
    return res.data;
  },
};

export const catalogApi = {
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const res = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return res.data;
  },

  getProductById: async (id: string): Promise<SingleResponse<Product>> => {
    const res = await apiClient.get<SingleResponse<Product>>(`/products/${id}`);
    return res.data;
  },

  getCategories: async (page = 1, limit = 50): Promise<PaginatedResponse<Category>> => {
    const res = await apiClient.get<PaginatedResponse<Category>>('/categories', {
      params: { page, limit },
    });
    return res.data;
  },

  getCategoryById: async (id: string): Promise<SingleResponse<Category>> => {
    const res = await apiClient.get<SingleResponse<Category>>(`/categories/${id}`);
    return res.data;
  },

  getCategorySubcategories: async (categoryId: string): Promise<PaginatedResponse<SubCategory>> => {
    const res = await apiClient.get<PaginatedResponse<SubCategory>>(`/categories/${categoryId}/subcategories`);
    return res.data;
  },

  getSubcategories: async (page = 1, limit = 50): Promise<PaginatedResponse<SubCategory>> => {
    const res = await apiClient.get<PaginatedResponse<SubCategory>>('/subcategories', {
      params: { page, limit },
    });
    return res.data;
  },

  getBrands: async (page = 1, limit = 50): Promise<PaginatedResponse<Brand>> => {
    const res = await apiClient.get<PaginatedResponse<Brand>>('/brands', {
      params: { page, limit },
    });
    return res.data;
  },

  getBrandById: async (id: string): Promise<SingleResponse<Brand>> => {
    const res = await apiClient.get<SingleResponse<Brand>>(`/brands/${id}`);
    return res.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const res = await apiClient.get<CartResponse>('/cart');
    return res.data;
  },

  addToCart: async (productId: string): Promise<CartResponse> => {
    const res = await apiClient.post<CartResponse>('/cart', { productId });
    return res.data;
  },

  updateCartQuantity: async (productId: string, count: number): Promise<CartResponse> => {
    const res = await apiClient.put<CartResponse>(`/cart/${productId}`, { count });
    return res.data;
  },

  removeCartItem: async (productId: string): Promise<CartResponse> => {
    const res = await apiClient.delete<CartResponse>(`/cart/${productId}`);
    return res.data;
  },

  clearCart: async (): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>('/cart');
    return res.data;
  },
};

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistResponse> => {
    const res = await apiClient.get<WishlistResponse>('/wishlist');
    return res.data;
  },

  addToWishlist: async (productId: string): Promise<WishlistActionResponse> => {
    const res = await apiClient.post<WishlistActionResponse>('/wishlist', { productId });
    return res.data;
  },

  removeFromWishlist: async (productId: string): Promise<WishlistActionResponse> => {
    const res = await apiClient.delete<WishlistActionResponse>(`/wishlist/${productId}`);
    return res.data;
  },
};

export const addressApi = {
  getAddresses: async (): Promise<AddressesResponse> => {
    const res = await apiClient.get<AddressesResponse>('/addresses');
    return res.data;
  },

  addAddress: async (data: AddressInput): Promise<{ status: string; message: string; data: Address[] }> => {
    const res = await apiClient.post<{ status: string; message: string; data: Address[] }>('/addresses', data);
    return res.data;
  },

  removeAddress: async (id: string): Promise<{ status: string; message: string; data: Address[] }> => {
    const res = await apiClient.delete<{ status: string; message: string; data: Address[] }>(`/addresses/${id}`);
    return res.data;
  },
};

export const orderApi = {
  createCashOrder: async (cartId: string, shippingAddress: ShippingAddressInput): Promise<{ status: string; data: Order }> => {
    const res = await apiClient.post<{ status: string; data: Order }>(`/orders/${cartId}`, {
      shippingAddress,
    });
    return res.data;
  },

  createCheckoutSession: async (
    cartId: string,
    returnUrl: string,
    shippingAddress: ShippingAddressInput
  ): Promise<CheckoutSessionResponse> => {
    const res = await apiClient.post<CheckoutSessionResponse>(
      `/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
      { shippingAddress }
    );
    return res.data;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const res = await apiClient.get<Order[]>(`/orders/user/${userId}`);
    return res.data;
  },
};
