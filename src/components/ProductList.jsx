import { useState, useMemo } from "react";
import Product from "@/components/Product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function ProductList({ items }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((item) => item.category))];
    return cats.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) return items;
    return items.filter((item) => selectedCategories.includes(item.category));
  }, [items, selectedCategories]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="flex-1 min-h-0 rounded-md border overflow-hidden flex flex-col bg-card">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between gap-2 shrink-0">
        <h2 className="font-semibold shrink-0">Products</h2>
        <div className="flex flex-wrap gap-1 justify-end">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              size="xs"
              className="capitalize text-xs px-2 py-1"
            >
              {category.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid - Auto-fill based on available space */}
      <ScrollArea className="flex-1 min-h-0">
        <div
          className="grid gap-2 p-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          {filteredItems.map((item, index) => (
            <Product key={index} item={item} />
          ))}
        </div>
      </ScrollArea>

      {/* Footer with item count */}
      <div className="border-t p-2 text-center shrink-0">
        <span className="text-xs text-muted-foreground">
          {filteredItems.length} items
        </span>
      </div>
    </div>
  );
}
