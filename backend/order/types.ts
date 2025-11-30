export interface Order {
  id: number;
  user_id: string;
  total: number;
  discount: number;
  final_amount: number;
  order_date: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name?: string;
  product_name_ar?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
