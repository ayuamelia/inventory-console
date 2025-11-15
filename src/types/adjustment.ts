export interface Adjustment {
  id: number;
  product_id: number;
  sku?: string;
  qty: number;
  amount: number;
  created_at: Date;
}