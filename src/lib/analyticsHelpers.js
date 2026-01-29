import { getPeriodLabel } from "./dateUtils";

export function filterSalesByPeriod(sales, period) {
  if (period === "all") return sales;

  const filters = {
    today: (s) => getPeriodLabel(s.timestamp).today,
    week: (s) => getPeriodLabel(s.timestamp).thisWeek,
    month: (s) => getPeriodLabel(s.timestamp).thisMonth,
  };

  return sales.filter(filters[period] || (() => true));
}

export function getProductSales(sales) {
  const productMap = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productMap[item.itemName]) {
        productMap[item.itemName] = {
          itemName: item.itemName,
          quantity: 0,
          total: 0,
        };
      }
      productMap[item.itemName].quantity += item.quantity;
      productMap[item.itemName].total += item.amount;
    });
  });

  return Object.values(productMap).sort((a, b) => b.quantity - a.quantity);
}

export function calculateTotalSales(sales) {
  return sales.reduce((sum, sale) => sum + sale.total, 0);
}

function getSalesDataByPeriod(sales, periodType) {
  const dataMap = {};

  sales.forEach((sale) => {
    const date = new Date(sale.timestamp);
    let key, label;

    if (periodType === "daily") {
      key = date.toLocaleDateString();
      label = key;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      label = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }

    if (!dataMap[key]) {
      dataMap[key] = {
        [periodType === "daily" ? "date" : "month"]: label,
        sales: 0,
        transactions: 0,
      };
    }
    dataMap[key].sales += sale.total;
    dataMap[key].transactions += 1;
  });

  const labelKey = periodType === "daily" ? "date" : "month";
  return Object.values(dataMap).sort(
    (a, b) => new Date(a[labelKey]) - new Date(b[labelKey])
  );
}

export function getDailySalesData(sales) {
  return getSalesDataByPeriod(sales, "daily");
}

export function getMonthlySalesData(sales) {
  return getSalesDataByPeriod(sales, "monthly");
}

export function getSalesByCategory(sales) {
  const categoryMap = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = { name: item.category, value: 0 };
      }
      categoryMap[item.category].value += item.amount;
    });
  });

  return Object.values(categoryMap)
    .map((cat) => ({
      ...cat,
      name: cat.name.replace(/_/g, " "),
    }))
    .sort((a, b) => b.value - a.value);
}

export function getTopSellingItems(sales, limit = 5) {
  return getProductSales(sales).slice(0, limit);
}

export function getRemainingInventory(items, sales) {
  const soldMap = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!soldMap[item.itemName]) {
        soldMap[item.itemName] = 0;
      }
      soldMap[item.itemName] += item.quantity;
    });
  });

  const remainingMap = {};
  items.forEach((item) => {
    const sold = soldMap[item.itemName] || 0;
    remainingMap[item.itemName] = Math.max(0, item.inventory - sold);
  });

  return remainingMap;
}
