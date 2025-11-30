import { useQuery } from "@tanstack/react-query";
import { Package, Calendar, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "../lib/i18n-context";
import { useBackend } from "../lib/use-backend";

export function OrdersPage() {
  const { t } = useI18n();
  const backend = useBackend();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => backend.order.list({}),
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {t("orders.title")}
      </h1>

      {ordersData?.orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersData?.orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap gap-4 justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {t("orders.orderNumber")}
                      {order.id}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.order_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <p className="text-sm text-muted-foreground mb-1">{t("orders.total")}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    ${order.final_amount.toFixed(2)}
                  </p>
                  {order.discount > 0 && (
                    <p className="text-sm text-green-500">Saved ${order.discount.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
