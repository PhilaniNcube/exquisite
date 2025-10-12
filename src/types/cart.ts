export interface CartItem {
  id: string;
  product: string; // Product ID (relationship)
  quantity: number;
  priceAtPurchase: number;
  linePrice: number;
  picture: string; // SchoolPhoto ID (relationship)
  // Optional: include product details for display purposes
  productDetails?: {
    name: string;
    price: number;
    image?: string;
  };
  pictureDetails?: {
    name?: string;
    url?: string;
  };
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'linePrice'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
