import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "../components/product-card";
import { useI18n } from "../lib/i18n-context";
import backend from "~backend/client";

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export function ProductsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("newest");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => backend.product.categories(),
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", search, category, sort],
    queryFn: () =>
      backend.product.list({
        search: search || undefined,
        category: category || undefined,
        sort,
      }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {t("products.title")}
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t("products.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder={t("products.filter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.all")}</SelectItem>
            {categoriesData?.categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name} ({cat.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder={t("products.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sort.newest")}</SelectItem>
            <SelectItem value="price_asc">{t("sort.priceAsc")}</SelectItem>
            <SelectItem value="price_desc">{t("sort.priceDesc")}</SelectItem>
            <SelectItem value="name_asc">{t("sort.nameAsc")}</SelectItem>
            <SelectItem value="name_desc">{t("sort.nameDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-accent rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
