import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import { useTheme } from '../../context/ThemeContext';
import {
  useBusinessProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  useUploadProductImage,
} from '../../hooks/useBusiness';
import { Product } from '../../types/shops';

type ProductForm = Omit<Product, 'id'>;

const emptyForm: ProductForm = {
  name: '',
  price: 0,
  description: '',
  stock: 0,
  image: '',
  category: '',
};

const ManageProductsScreen = () => {
  const theme = useTheme();
  const { data: products, isLoading } = useBusinessProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const uploadMutation = useUploadProductImage();

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editingProduct) return;
    const { id, ...rest } = editingProduct;
    setForm(rest);
  }, [editingProduct]);

  const validationErrors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.category?.trim()) next.category = 'Category is required';
    if (form.price <= 0) next.price = 'Price must be greater than 0';
    if (form.stock < 0) next.stock = 'Stock cannot be negative';
    return next;
  }, [form]);

  const handleChange = (key: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'price' || key === 'stock' ? Number(value) : value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setErrors({});
  };

  const handleSubmit = () => {
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, payload: form }, { onSuccess: resetForm });
    } else {
      createMutation.mutate(form, { onSuccess: resetForm });
    }
  };

  const handleDelete = (product: Product) => {
    Alert.alert('Delete product', `Remove ${product.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(product.id),
      },
    ]);
  };

  const handleUpload = () => {
    const candidate = form.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
    uploadMutation.mutate(candidate, {
      onSuccess: (url) => setForm((prev) => ({ ...prev, image: url })),
    });
  };

  const renderProductRow = (product: Product) => (
    <Card key={product.id}>
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          {product.image ? <Image source={{ uri: product.image }} style={styles.thumbnail} /> : null}
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.name}>{product.name}</ThemedText>
            <ThemedText style={styles.meta}>${product.price.toFixed(2)} · Stock: {product.stock}</ThemedText>
            <ThemedText style={[styles.meta, { marginTop: 4 }]} numberOfLines={2}>
              {product.description}
            </ThemedText>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => setEditingProduct(product)} accessibilityRole="button">
            <ThemedText style={[styles.actionText, { color: theme.colors.primary }]}>Edit</ThemedText>
          </Pressable>
          <Pressable onPress={() => handleDelete(product)} accessibilityRole="button">
            <ThemedText style={[styles.actionText, { color: theme.colors.danger }]}>Delete</ThemedText>
          </Pressable>
        </View>
      </View>
    </Card>
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <ThemedText accessibilityRole="header" style={styles.title}>
          Products
        </ThemedText>
        <ThemedText style={styles.subtitle}>Create new listings and manage stock in one place.</ThemedText>

        <Card>
          <ThemedText style={styles.sectionTitle}>{editingProduct ? 'Edit Product' : 'Add Product'}</ThemedText>
          <FormTextInput
            label="Name"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="e.g. Almond Milk"
            error={errors.name}
          />
          <FormTextInput
            label="Category"
            value={form.category}
            onChangeText={(text) => handleChange('category', text)}
            placeholder="Groceries, Snacks"
            error={errors.category}
          />
          <FormTextInput
            label="Price"
            value={form.price.toString()}
            onChangeText={(text) => handleChange('price', text)}
            keyboardType="decimal-pad"
            error={errors.price}
          />
          <FormTextInput
            label="Stock"
            value={form.stock.toString()}
            onChangeText={(text) => handleChange('stock', text)}
            keyboardType="number-pad"
            error={errors.stock}
          />
          <FormTextInput
            label="Description"
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="What makes this product great?"
            multiline
            style={{ minHeight: 80 }}
            error={errors.description}
          />
          <FormTextInput
            label="Image URL"
            value={form.image}
            onChangeText={(text) => handleChange('image', text)}
            placeholder="https://"
          />
          <View style={styles.uploadRow}>
            <PrimaryButton
              title={uploadMutation.isLoading ? 'Uploading...' : 'Upload Image'}
              onPress={handleUpload}
              style={{ flex: 1 }}
              loading={uploadMutation.isLoading}
            />
            {form.image ? <Image source={{ uri: form.image }} style={styles.preview} /> : null}
          </View>
          <PrimaryButton
            title={editingProduct ? 'Save Product' : 'Add Product'}
            onPress={handleSubmit}
            loading={createMutation.isLoading || updateMutation.isLoading}
          />
          {editingProduct ? (
            <Pressable onPress={resetForm} accessibilityRole="button" style={styles.resetButton}>
              <ThemedText style={{ color: theme.colors.muted }}>Cancel edit</ThemedText>
            </Pressable>
          ) : null}
        </Card>

        <ThemedText style={[styles.sectionTitle, { marginTop: 16 }]}>Catalog</ThemedText>
        {isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
        {products?.map(renderProductRow)}
        {!products?.length && !isLoading ? (
          <Card>
            <ThemedText>No products yet. Add your first product above.</ThemedText>
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#4B5563',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  name: {
    fontWeight: '700',
  },
  meta: {
    color: '#4B5563',
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  actionText: {
    fontWeight: '600',
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  resetButton: {
    marginTop: 12,
    alignItems: 'center',
  },
});

export default ManageProductsScreen;
