import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (!product) {
    notFound()
  }

  const isLowStock = product.quantity_in_stock <= product.reorder_level

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/inventory">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-1">Product details and inventory status</p>
        </div>
        {isLowStock ? <Badge variant="destructive">Low Stock</Badge> : <Badge variant="default">In Stock</Badge>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">SKU</p>
              <p className="text-base mt-1 font-mono">{product.sku}</p>
            </div>
            {product.category && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-base mt-1">{product.category}</p>
              </div>
            )}
            {product.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-base mt-1">{product.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unit Price</p>
              <p className="text-2xl font-bold mt-1">${product.unit_price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quantity in Stock</p>
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{product.quantity_in_stock}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reorder Level</p>
              <p className="text-base mt-1">{product.reorder_level}</p>
            </div>
            {isLowStock && (
              <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                <p className="text-sm font-medium text-destructive">
                  Stock level is at or below reorder threshold. Consider placing a new order.
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-base mt-1">{new Date(product.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
