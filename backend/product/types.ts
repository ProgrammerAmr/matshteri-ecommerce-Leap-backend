export interface Product {
  id: number;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}
