import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MoreHorizontal,
  TrendingUp,
  ShoppingCart,
  Package,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarts } from "@/contexts/CartContext";
import { PERIOD_OPTIONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  filterSalesByPeriod,
  getProductSales,
  calculateTotalSales,
  getDailySalesData,
  getMonthlySalesData,
  getSalesByCategory,
  getTopSellingItems,
} from "@/lib/analyticsHelpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const navigate = useNavigate();
  const { sale, setSale } = useCarts();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [chartType, setChartType] = useState("daily");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredSales = filterSalesByPeriod(sale, selectedPeriod);
  const totalSalesPeriod = calculateTotalSales(filteredSales);
  const productSales = getProductSales(filteredSales);
  const topItems = getTopSellingItems(filteredSales, 5);
  const salesByCategory = getSalesByCategory(filteredSales);
  const dailySalesData = getDailySalesData(filteredSales);
  const monthlySalesData = getMonthlySalesData(filteredSales);

  const totalItemsSold = filteredSales.reduce(
    (sum, s) =>
      sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  );

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setSheetOpen(true);
  };

  const handleDeleteTransaction = (transactionId) => {
    setSale(sale.filter((s) => s.id !== transactionId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/sale")} variant="outline">
            Sales Journal
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Period Filter - Select */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Period:</span>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="py-0 bg-primary text-primary-foreground border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-80">Total Revenue</p>
                <TrendingUp className="h-4 w-4 opacity-70" />
              </div>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(totalSalesPeriod)}
              </p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{filteredSales.length}</p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{totalItemsSold}</p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Top Product</p>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold mt-1 truncate">
                {topItems[0]?.itemName || "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row - Tabs for Sales Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart with Tabs */}
          <Card className="py-0">
            <CardHeader className="py-4">
              <CardTitle className="text-base">Sales Trends</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <Tabs value={chartType} onValueChange={setChartType}>
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-0">
                  {dailySalesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [
                            formatCurrency(value),
                            "Sales",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="monthly" className="mt-0">
                  {monthlySalesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [
                            formatCurrency(value),
                            "Sales",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="py-0">
            <CardHeader className="py-4">
              <CardTitle className="text-base">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {salesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-background)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Bar
                      dataKey="value"
                      name="Sales"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Items */}
          <Card className="py-0">
            <CardHeader className="py-4">
              <CardTitle className="text-base">Top 5 Selling Items</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {topItems.length > 0 ? (
                <div className="space-y-3">
                  {topItems.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                      >
                        {index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {product.itemName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.quantity} sold
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(product.total)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions with Dropdown */}
          <Card className="py-0">
            <CardHeader className="py-4">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {filteredSales.length > 0 ? (
                <div className="space-y-2">
                  {filteredSales
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleViewTransaction(s)}
                        >
                          <p className="font-medium">
                            {formatCurrency(s.total)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {s.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            )}{" "}
                            items
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewTransaction(s)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteTransaction(s.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No transactions found for the selected period.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Products Table */}
        {productSales.length > 0 && (
          <Card className="py-0">
            <CardHeader className="py-4">
              <CardTitle className="text-base">
                All Products Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSales.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {product.itemName}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transaction Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription>
              {selectedTransaction &&
                new Date(selectedTransaction.timestamp).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
            </SheetDescription>
          </SheetHeader>
          {selectedTransaction && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold">
                  {formatCurrency(selectedTransaction.total)}
                </span>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium mb-2">Items</p>
                {selectedTransaction.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.itemName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>{formatCurrency(selectedTransaction.total)}</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
