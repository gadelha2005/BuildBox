export interface StockMovementInput {
  productId: number;
  variantId?: number;
  userId: number;
  quantity: number;
  reason?: string;
}

export interface StockItem {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  lowStock: boolean;
  variants: {
    id: number;
    size: string | null;
    color: string | null;
    stock: number;
  }[];
}