import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardCharts } from "@/components/dashboard-charts"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch comprehensive statistics
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: completedOrders },
    { count: lowStockProducts },
    { count: totalSuppliers },
    { count: totalProducts },
    { count: totalInvoices },
    { data: recentOrders },
    { data: recentProjects },
    { data: orderStats },
    { data: invoiceStats },
    { data: erpLogs },
    { data: qualityChecks },
  ] = await Promise.all([
    supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
    supabase
      .from("purchase_orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["draft", "submitted", "approved"]),
    supabase.from("purchase_orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
    supabase.from("products").select("*", { count: "exact", head: true }).lt("quantity_in_stock", 10),
    supabase.from("suppliers").select("*", { count: "exact", head: true }).eq("status", "validated"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
    supabase.from("purchase_orders").select("*, suppliers(name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("purchase_orders").select("status, total_amount, created_at").not("total_amount", "is", null),
    supabase.from("invoices").select("status, total_amount, paid_amount, created_at").not("total_amount", "is", null),
    supabase.from("erp_logs").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("quality_checks").select("result").not("result", "is", null),
  ])

  // Calculate financial metrics
  const totalOrderValue = orderStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
  const totalInvoiceAmount = invoiceStats?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
  const totalPaidAmount = invoiceStats?.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0
  const outstandingAmount = totalInvoiceAmount - totalPaidAmount

  // Order status breakdown for chart
  const orderStatusCounts =
    orderStats?.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}

  // Quality check breakdown
  const qualityStats =
    qualityChecks?.reduce((acc: Record<string, number>, check) => {
      acc[check.result] = (acc[check.result] || 0) + 1
      return acc
    }, {}) || {}

  // Prepare chart data
  const orderStatusData = Object.entries(orderStatusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
    value: value as number,
    fill:
      name === "delivered"
        ? "hsl(var(--chart-1))"
        : name === "approved"
          ? "hsl(var(--chart-2))"
          : name === "submitted"
            ? "hsl(var(--chart-3))"
            : name === "draft"
              ? "hsl(var(--chart-4))"
              : "hsl(var(--chart-5))",
  }))

  const qualityData = Object.entries(qualityStats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
    fill: name === "passed" ? "hsl(142, 76%, 36%)" : name === "failed" ? "hsl(0, 84%, 60%)" : "hsl(45, 93%, 47%)",
  }))

  const financialData = [
    { name: "Total Orders", value: totalOrderValue },
    { name: "Invoiced", value: totalInvoiceAmount },
    { name: "Paid", value: totalPaidAmount },
    { name: "Outstanding", value: outstandingAmount },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      submitted: "outline",
      approved: "default",
      delivered: "default",
      cancelled: "destructive",
      active: "default",
      completed: "default",
      on_hold: "secondary",
    }
    return variants[status] || "outline"
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      delivered: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    }
    return colors[status] || "bg-slate-100 text-slate-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your procurement operations.</p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className="font-medium text-emerald-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </span>
              vs last month
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">Awaiting processing</div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedOrders || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">Successfully delivered</div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockProducts || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className="font-medium text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3" />
                Need attention
              </span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
        </Card>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrderValue.toLocaleString("fr-TN", { minimumFractionDigits: 2 })} DT
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Invoiced</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInvoiceAmount.toLocaleString("fr-TN", { minimumFractionDigits: 2 })} DT
            </div>
            <p className="text-xs text-muted-foreground mt-1">{totalInvoices || 0} invoices total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {totalPaidAmount.toLocaleString("fr-TN", { minimumFractionDigits: 2 })} DT
            </div>
            <p className="text-xs text-muted-foreground mt-1">Payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {outstandingAmount.toLocaleString("fr-TN", { minimumFractionDigits: 2 })} DT
            </div>
            <p className="text-xs text-muted-foreground mt-1">Amount due</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts
        orderStatusData={orderStatusData}
        qualityData={qualityData}
        financialData={financialData}
        totalSuppliers={totalSuppliers || 0}
        totalProducts={totalProducts || 0}
      />

      {/* Recent Activity Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest order activity</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.suppliers?.name || "No supplier"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {order.total_amount?.toLocaleString("fr-TN", { minimumFractionDigits: 2 }) || "0.00"} DT
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No purchase orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Active project tracking</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Budget: {project.budget?.toLocaleString("fr-TN", { minimumFractionDigits: 2 }) || "0.00"} DT
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                      {project.status?.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Inventory & ERP Logs */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm">Active Suppliers</span>
              </div>
              <span className="text-lg font-bold">{totalSuppliers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                  <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm">Products in Stock</span>
              </div>
              <span className="text-lg font-bold">{totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                  <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm">Total Invoices</span>
              </div>
              <span className="text-lg font-bold">{totalInvoices || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                  <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm">Quality Checks</span>
              </div>
              <span className="text-lg font-bold">{qualityChecks?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* ERP Integration Logs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent ERP Logs</CardTitle>
            <CardDescription>System integration activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {erpLogs && erpLogs.length > 0 ? (
                  erpLogs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="capitalize font-medium">{log.entity_type}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.action?.replace("_", " ")}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            log.status === "success"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              : log.status === "failed"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
  )
}
