"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [formData, setFormData] = useState({
    order_number: `PO-${Date.now()}`,
    project_id: "",
    supplier_id: "",
    status: "draft",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const [suppliersRes, projectsRes, productsRes] = await Promise.all([
        supabase.from("suppliers").select("*").eq("status", "validated"),
        supabase.from("projects").select("*").in("status", ["approved", "in_progress"]),
        supabase.from("products").select("*"),
      ])

      if (suppliersRes.data) setSuppliers(suppliersRes.data)
      if (projectsRes.data) setProjects(projectsRes.data)
      if (productsRes.data) setProducts(productsRes.data)
    }

    fetchData()
  }, [])

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: "", product_name: "", quantity: 1, unit_price: 0 }])
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "product_id" && value) {
      const product = products.find((p) => p.id === value)
      if (product) {
        updatedItems[index].product_name = product.name
        updatedItems[index].unit_price = product.unit_price
      }
    }

    setOrderItems(updatedItems)
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (orderItems.length === 0) {
      setError("Please add at least one item to the order")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const totalAmount = calculateTotal()

      // Insert purchase order
      const { data: order, error: orderError } = await supabase
        .from("purchase_orders")
        .insert({
          order_number: formData.order_number,
          project_id: formData.project_id || null,
          supplier_id: formData.supplier_id || null,
          status: formData.status,
          total_amount: totalAmount,
          notes: formData.notes || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const itemsToInsert = orderItems.map((item) => ({
        purchase_order_id: order.id,
        product_id: item.product_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }))

      const { error: itemsError } = await supabase.from("purchase_order_items").insert(itemsToInsert)

      if (itemsError) throw itemsError

      router.push("/orders")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Purchase Order</h1>
          <p className="text-muted-foreground mt-1">Create a new purchase order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order_number">Order Number</Label>
                <Input
                  id="order_number"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project_id">Project (Optional)</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_id">Supplier</Label>
                <Select
                  value={formData.supplier_id}
                  onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this order..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <Button type="button" onClick={addOrderItem} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex gap-4 items-end border-b pb-4 last:border-0">
                <div className="flex-1 space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={item.product_id}
                    onValueChange={(value) => updateOrderItem(index, "product_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.unit_price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-24 space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="w-32 space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateOrderItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="w-32">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-base font-medium">${(item.quantity * item.unit_price).toFixed(2)}</p>
                </div>

                <Button type="button" variant="ghost" size="icon" onClick={() => removeOrderItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {orderItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No items added. Click "Add Item" to get started.</p>
            )}

            {orderItems.length > 0 && (
              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Order"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/orders">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
