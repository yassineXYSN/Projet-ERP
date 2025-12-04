import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name, contact_person, email, phone), profiles(full_name), projects(title)")
    .eq("id", params.id)
    .single()

  if (!order) {
    notFound()
  }

  const { data: orderItems } = await supabase
    .from("purchase_order_items")
    .select("*")
    .eq("purchase_order_id", params.id)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      submitted: "outline",
      approved: "default",
      rejected: "destructive",
      sent_to_supplier: "default",
      confirmed: "default",
      in_transit: "default",
      delivered: "default",
      cancelled: "destructive",
    }
    return variants[status] || "outline"
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{order.order_number}</h1>
          <p className="text-muted-foreground mt-1">Purchase order details</p>
        </div>
        <Badge variant={getStatusBadge(order.status)} className="text-sm">
          {order.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Order Number</p>
              <p className="text-base mt-1 font-mono">{order.order_number}</p>
            </div>
            {order.projects && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project</p>
                <p className="text-base mt-1">{order.projects.title}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-base mt-1">{order.profiles?.full_name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created Date</p>
              <p className="text-base mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-base mt-1">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.suppliers ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier Name</p>
                  <p className="text-base mt-1">{order.suppliers.name}</p>
                </div>
                {order.suppliers.contact_person && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p className="text-base mt-1">{order.suppliers.contact_person}</p>
                  </div>
                )}
                {order.suppliers.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base mt-1">{order.suppliers.email}</p>
                  </div>
                )}
                {order.suppliers.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-base mt-1">{order.suppliers.phone}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No supplier assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No items in this order
                  </TableCell>
                </TableRow>
              )}
              {orderItems && orderItems.length > 0 && (
                <TableRow className="font-bold">
                  <TableCell colSpan={3} className="text-right">
                    Total Amount:
                  </TableCell>
                  <TableCell className="text-right text-lg">${order.total_amount?.toFixed(2) || "0.00"}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
