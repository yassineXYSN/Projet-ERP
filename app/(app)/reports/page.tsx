import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ReportsPage() {
  const supabase = await createClient();

  // Fetch comprehensive statistics
  const [
    { count: totalOrders },
    { count: totalSuppliers },
    { count: totalProducts },
    { count: totalInvoices },
    { data: orderStats },
    { data: invoiceStats },
    { data: erpLogs },
  ] = await Promise.all([
    supabase
      .from("purchase_orders")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })
      .eq("status", "validated"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
    supabase
      .from("purchase_orders")
      .select("status, total_amount")
      .not("total_amount", "is", null),
    supabase
      .from("invoices")
      .select("status, total_amount, paid_amount")
      .not("total_amount", "is", null),
    supabase
      .from("erp_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Calculate total order value
  const totalOrderValue =
    orderStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

  // Calculate invoice statistics
  const totalInvoiceAmount =
    invoiceStats?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
  const totalPaidAmount =
    invoiceStats?.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
  const outstandingAmount = totalInvoiceAmount - totalPaidAmount;

  // Order status breakdown
  const orderStatusCounts =
    orderStats?.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of procurement operations and ERP integration
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total order value: ${totalOrderValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Suppliers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Validated suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total inventory items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total amount: ${totalInvoiceAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalPaidAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total payments received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${outstandingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Amount due</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(orderStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {status.replace("_", " ")}
                  </span>
                  <span className="text-sm font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent ERP Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {erpLogs && erpLogs.length > 0 ? (
                  erpLogs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="capitalize">
                        {log.entity_type}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.action.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            log.status === "success"
                              ? "bg-green-100 text-green-700"
                              : log.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(log.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-4"
                    >
                      No ERP logs yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
