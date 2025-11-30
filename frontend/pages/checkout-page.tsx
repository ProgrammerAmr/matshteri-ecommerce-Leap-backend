import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "../lib/i18n-context";
import { useBackend } from "../lib/use-backend";

export function CheckoutPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [discountCode, setDiscountCode] = useState("");
  const backend = useBackend();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => backend.cart.get(),
  });

  const placeOrder = useMutation({
    mutationFn: () =>
      backend.order.create({
        discount_code: discountCode || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Success!",
        description: "Your order has been placed successfully",
      });
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Place order error:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    },
  });

  if (!cart?.items.length) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {t("checkout.title")}
      </h1>

      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.product_price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">{t("checkout.discount")}</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button variant="outline">{t("checkout.apply")}</Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Try: SAVE10, SAVE20, SAVE30, FIXED10, FIXED25, WELCOME15
        </p>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center text-2xl font-bold">
          <span>Total</span>
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ${cart.total.toFixed(2)}
          </span>
        </div>
      </Card>

      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6"
        onClick={() => placeOrder.mutate()}
        disabled={placeOrder.isPending}
      >
        {t("checkout.placeOrder")}
      </Button>
    </div>
  );
}
