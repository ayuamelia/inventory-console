export interface Product {
  id: number;
  sku: string;
  title: string;
  price: number;
  description: string | null;
  image_url: string | null;
  category: string | null;
  stock?: number;
}