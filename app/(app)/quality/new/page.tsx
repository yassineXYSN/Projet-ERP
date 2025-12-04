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
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewQualityCheckPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receptions, setReceptions] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    reception_id: "",
    product_id: "",
    check_type: "Visual Inspection",
    result: "passed",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const [receptionsRes, productsRes] = await Promise.all([
        supabase.from("receptions").select("*").order("reception_date", { ascending: false }),
        supabase.from("products").select("*"),
      ])

      if (receptionsRes.data) setReceptions(receptionsRes.data)
      if (productsRes.data) setProducts(productsRes.data)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const { error: insertError } = await supabase.from("quality_checks").insert({
        reception_id: formData.reception_id,
        product_id: formData.product_id || null,
        check_type: formData.check_type,
        result: formData.result,
        inspector_id: user.id,
        notes: formData.notes || null,
        checked_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      router.push("/quality")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/quality">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Quality Check</h1>
          <p className="text-muted-foreground mt-1">Perform a quality inspection</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reception_id">Reception</Label>
              <Select
                value={formData.reception_id}
                onValueChange={(value) => setFormData({ ...formData, reception_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reception" />
                </SelectTrigger>
                <SelectContent>
                  {receptions.map((reception) => (
                    <SelectItem key={reception.id} value={reception.id}>
                      {reception.reception_number} - {new Date(reception.reception_date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_id">Product</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="check_type">Check Type</Label>
              <Input
                id="check_type"
                placeholder="Visual Inspection, Functional Test, etc."
                value={formData.check_type}
                onChange={(e) => setFormData({ ...formData, check_type: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <Select value={formData.result} onValueChange={(value) => setFormData({ ...formData, result: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="conditional">Conditional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Inspection findings and observations..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Inspection"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/quality">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
