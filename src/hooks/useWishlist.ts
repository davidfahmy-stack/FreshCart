'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { wishlistApi, cartApi } from '../services/api';
import { WishlistResponse } from '../types/api.types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY_WISHLIST_RESPONSE: WishlistResponse = {
  status: 'success',
  count: 0,
  data: [],
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

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: async (): Promise<WishlistResponse> => {
      try {
        return await wishlistApi.getWishlist();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return EMPTY_WISHLIST_RESPONSE;
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 3,
    retry: false,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.addToWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(data.message || 'Product added to wishlist!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to add to wishlist'));
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.removeFromWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(data.message || 'Product removed from wishlist');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to remove from wishlist'));
    },
  });

  const moveToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const cartData = await cartApi.addToCart(productId);
      await wishlistApi.removeFromWishlist(productId);
      return cartData;
    },
    onSuccess: async (cartData) => {
      queryClient.setQueryData(['cart'], cartData);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['cart'] }),
        queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
      ]);
      toast.success('Product moved to cart!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to move product to cart'));
    },
  });

  const wishlistItems = wishlistQuery.data?.data || [];
  const count = wishlistQuery.data?.count ?? wishlistItems.length;

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item._id === productId || item.id === productId);
  };

  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login first to manage your wishlist');
      return;
    }
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlistItems,
    count,
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    isAdding: addToWishlistMutation.isPending,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isRemoving: removeFromWishlistMutation.isPending,
    moveToCart: moveToCartMutation.mutate,
    moveToCartAsync: moveToCartMutation.mutateAsync,
    isMovingToCart: moveToCartMutation.isPending,
    refetch: wishlistQuery.refetch,
  };
};

export default useWishlist;
