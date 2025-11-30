import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "../lib/i18n-context";
import { useBackend } from "../lib/use-backend";
import type { Product } from "~backend/product/types";

export function ProductCard({ product }: { product: Product }) {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const backend = useBackend();

  const addToCart = useMutation({
    mutationFn: () =>
      backend.cart.add({
        product_id: product.id,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Product added to cart",
      });
      setQuantity(1);
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const productName = language === "ar" && product.name_ar ? product.name_ar : product.name;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image_url || "https://via.placeholder.com/500"}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">{t("products.outOfStock")}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{productName}</h3>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">{product.stock_quantity} in stock</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="flex items-center border border-border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="px-3 text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
            disabled={isOutOfStock}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Button
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          onClick={() => addToCart.mutate()}
          disabled={isOutOfStock || addToCart.isPending}
        >
          <ShoppingCart className="w-4 h-4 me-2" />
          {t("products.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
}
