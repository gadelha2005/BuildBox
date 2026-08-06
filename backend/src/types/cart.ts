export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  variantProductId: number | null;
  quantity: number;
  createdAt: Date;
}

export interface AddToCartInput {
  userId: number;
  productId: number;
  variantId?: number;
  quantity: number;
}