import { create } from 'zustand';
import { fetchProducts, fetchShopDetails, fetchShops } from '../api/shops';
import { createOrder } from '../api/orders';
import { CartItem, Product, Shop } from '../types/shops';

interface ShopState {
  shops: Shop[];
  categories: string[];
  selectedCategory?: string;
  searchQuery: string;
  suggestions: string[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  currentShop?: Shop;
  products: Product[];
  cart: CartItem[];
  orderConfirmation?: { orderNumber: string; eta: string };
  setSearchQuery: (query: string) => void;
  setCategory: (category?: string) => void;
  loadShops: (reset?: boolean) => Promise<void>;
  loadMoreShops: () => Promise<void>;
  loadShopDetails: (shopId: string) => Promise<void>;
  loadProducts: (shopId: string) => Promise<void>;
  addToCart: (shopId: string, product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  submitOrder: (payload: { note: string; address: string }) => Promise<void>;
}

const categoriesSeed = ['Groceries', 'Electronics', 'Cafe', 'Fashion', 'Bakery', 'Wellness'];

const buildSuggestions = (shops: Shop[], query: string) => {
  if (!query) return [];
  const lower = query.toLowerCase();
  const names = shops
    .filter((shop) => shop.name.toLowerCase().includes(lower) || shop.category.toLowerCase().includes(lower))
    .map((shop) => shop.name);
  const unique = Array.from(new Set([...names, query]));
  return unique.slice(0, 6);
};

export const useShopStore = create<ShopState>((set, get) => ({
  shops: [],
  categories: categoriesSeed,
  selectedCategory: undefined,
  searchQuery: '',
  suggestions: [],
  page: 1,
  hasMore: true,
  loading: false,
  currentShop: undefined,
  products: [],
  cart: [],
  orderConfirmation: undefined,
  setSearchQuery: (query) =>
    set((state) => ({
      searchQuery: query,
      suggestions: buildSuggestions(state.shops, query),
    })),
  setCategory: (category) =>
    set(() => ({
      selectedCategory: category,
      page: 1,
      shops: [],
      hasMore: true,
    })),
  loadShops: async (reset = false) => {
    const { searchQuery, selectedCategory } = get();
    set({ loading: true });
    const page = reset ? 1 : get().page;
    const response = await fetchShops(page, searchQuery, selectedCategory);
    set((state) => ({
      shops: reset ? response.items : [...state.shops, ...response.items],
      hasMore: response.hasMore,
      page: page + 1,
      loading: false,
    }));
  },
  loadMoreShops: async () => {
    const { hasMore, loading } = get();
    if (!hasMore || loading) return;
    await get().loadShops();
  },
  loadShopDetails: async (shopId: string) => {
    set({ loading: true });
    const shop = await fetchShopDetails(shopId);
    set({ currentShop: shop, loading: false });
  },
  loadProducts: async (shopId: string) => {
    set({ loading: true });
    const products = await fetchProducts(shopId);
    set({ products, loading: false });
  },
  addToCart: (shopId, product, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        };
      }
      return {
        cart: [...state.cart, { ...product, quantity, shopId }],
      };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item)),
    })),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter((item) => item.id !== productId) })),
  clearCart: () => set({ cart: [], orderConfirmation: undefined }),
  submitOrder: async ({ note, address }) => {
    const { cart, currentShop } = get();
    if (!cart.length || !currentShop) {
      return;
    }
    const order = await createOrder({
      items: cart,
      shopId: currentShop.id,
      shopName: currentShop.name,
      shopArea: currentShop.area,
      deliveryAddress: address,
      paymentMethod: note,
      customerName: 'You',
    });
    set({ orderConfirmation: { orderNumber: order.orderNumber, eta: order.eta || '30-40 mins' }, cart: [] });
  },
}));

export const selectCartCount = (state: ShopState) =>
  state.cart.reduce((count, item) => count + item.quantity, 0);

export const selectCartTotals = (state: ShopState) => {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // placeholder tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};
