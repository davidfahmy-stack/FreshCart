'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { cartApi } from '../services/api';
import { CartResponse } from '../types/api.types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY_CART_RESPONSE: CartResponse = {
  status: 'success',
  numOfCartItems: 0,
  data: {
    _id: '',
    cartOwner: '',
    products: [],
    totalCartPrice: 0,
  },
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async (): Promise<CartResponse> => {
      try {
        return await cartApi.getCart();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return EMPTY_CART_RESPONSE;
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartApi.addToCart(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(data.message || 'Product added to your cart!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to add product to cart'));
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      cartApi.updateCartQuantity(productId, count),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart updated successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to update quantity'));
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeCartItem(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to remove item'));
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(['cart'], EMPTY_CART_RESPONSE);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to clear cart'));
    },
  });

  const cart = cartQuery.data?.data;
  const numOfCartItems = cartQuery.data?.numOfCartItems || 0;
  const cartId = cartQuery.data?.cartId || cart?._id || undefined;

  return {
    cart,
    cartId,
    numOfCartItems,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    refetch: cartQuery.refetch,
    addToCart: addToCartMutation.mutate,
    addToCartAsync: addToCartMutation.mutateAsync,
    isAddingToCart: addToCartMutation.isPending,
    updateQuantity: updateQuantityMutation.mutate,
    updateQuantityAsync: updateQuantityMutation.mutateAsync,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemovingItem: removeItemMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearingCart: clearCartMutation.isPending,
  };
};

export default useCart;
