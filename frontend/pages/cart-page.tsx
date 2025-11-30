import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "../lib/i18n-context";
import { useBackend } from "../lib/use-backend";

export function CartPage() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const backend = useBackend();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => backend.cart.get(),
  });

  const updateQuantity = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      backend.cart.update({ id, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Update quantity error:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  const removeItem = useMutation({
    mutationFn: (id: number) => backend.cart.remove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    },
    onError: (error) => {
      console.error("Remove item error:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-accent rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("cart.empty")}</h2>
        <Link to="/products">
          <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500">
            {t("cart.continueShopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {t("cart.title")}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const productName =
              language === "ar" && item.product_name_ar ? item.product_name_ar : item.product_name;

            return (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product_image_url || "https://via.placeholder.com/150"}
                    alt={productName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{productName}</h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                      ${item.product_price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <Input
                        type="number"
                        min="1"
                        max={item.product_stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value);
                          if (qty > 0 && qty <= item.product_stock) {
                            updateQuantity.mutate({ id: item.id, quantity: qty });
                          }
                        }}
                        className="w-20"
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem.mutate(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-end">
                    <p className="text-lg font-semibold">
                      ${(item.product_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-4 border-t border-border">
                <span>{t("cart.total")}</span>
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {t("cart.checkout")}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
