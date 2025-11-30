export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  added_at: Date;
  product_name: string;
  product_name_ar?: string;
  product_price: number;
  product_image_url?: string;
  product_stock: number;
}
