import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBusinessProduct,
  deleteBusinessProduct,
  fetchBusinessAnalytics,
  fetchBusinessProducts,
  fetchBusinessShop,
  updateBusinessProduct,
  updateBusinessShop,
  uploadProductImage,
} from '../api/business';
import { BusinessAnalytics, BusinessShopProfile, Product } from '../types/shops';

export const useBusinessShop = () =>
  useQuery<BusinessShopProfile, Error>({ queryKey: ['business', 'shop'], queryFn: fetchBusinessShop });

export const useUpdateBusinessShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBusinessShop,
    onSuccess: (shop) => {
      queryClient.setQueryData(['business', 'shop'], shop);
      queryClient.invalidateQueries({ queryKey: ['business', 'analytics'] });
    },
  });
};

export const useBusinessProducts = () =>
  useQuery<Product[], Error>({ queryKey: ['business', 'products'], queryFn: fetchBusinessProducts });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusinessProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) => updateBusinessProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business', 'products'] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusinessProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business', 'products'] }),
  });
};

export const useUploadProductImage = () =>
  useMutation({ mutationFn: (uri: string) => uploadProductImage(uri) });

export const useBusinessAnalytics = () =>
  useQuery<BusinessAnalytics, Error>({ queryKey: ['business', 'analytics'], queryFn: fetchBusinessAnalytics });

