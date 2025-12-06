import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/stat-card"
import { ShoppingCart, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: completedOrders },
    { count: lowStockProducts },
    { data: recentOrders },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from("purchase_orders").select("*", { count: "exact", head: true }),
    supabase
      .from("purchase_orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["draft", "submitted", "approved"]),
    supabase.from("purchase_orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .lt("quantity_in_stock", supabase.rpc("quantity_in_stock")),
    supabase.from("purchase_orders").select("*, suppliers(name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(5),
  ])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      submitted: "default",
      approved: "default",
      delivered: "default",
      cancelled: "destructive",
    }
    return variants[status] || "outline"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your procurement operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={totalOrders || 0}
          description="All time purchase orders"
          icon={ShoppingCart}
        />
        <StatCard title="Pending Orders" value={pendingOrders || 0} description="Awaiting processing" icon={Clock} />
        <StatCard
          title="Completed Orders"
          value={completedOrders || 0}
          description="Successfully delivered"
          icon={CheckCircle}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts || 0}
          description="Need reordering"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Purchase Orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${order.total_amount?.toFixed(2) || "0.00"}</span>
                      <Badge variant={getStatusBadge(order.status)}>{order.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No purchase orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Button asChild variant="ghost" size="sm">
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
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(project.status)}>{project.status.replace("_", " ")}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
