"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewReceptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [formData, setFormData] = useState({
    purchase_order_id: "",
    reception_date: new Date().toISOString().split("T")[0],
    status: "pending",
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("purchase_orders")
          .select("id, order_number, status")
        console.log("[v0] Purchase orders fetched:", data)
        if (error) {
          console.error("[v0] Error fetching purchase orders:", error)
          setError("Failed to load purchase orders")
        }
        if (data) setPurchaseOrders(data)
      } catch (err) {
        console.error("[v0] Exception fetching purchase orders:", err)
      }
    }
    fetchOrders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Generate reception number
      const receptionNumber = `REC-${Date.now()}`

      const { error: insertError } = await supabase.from("receptions").insert({
        reception_number: receptionNumber,
        purchase_order_id: formData.purchase_order_id,
        reception_date: formData.reception_date,
        status: formData.status,
        received_by: user.id,
      })

      if (insertError) throw insertError

      router.push("/receptions")
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
          <Link href="/receptions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Réception</h1>
          <p className="text-muted-foreground mt-1">Enregistrer une réception de marchandises</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la Réception</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_order_id">Bon de Commande</Label>
              <Select
                value={formData.purchase_order_id}
                onValueChange={(value) => setFormData({ ...formData, purchase_order_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bon de commande" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reception_date">Date de Réception</Label>
              <Input
                id="reception_date"
                type="date"
                value={formData.reception_date}
                onChange={(e) => setFormData({ ...formData, reception_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                  <SelectItem value="complete">Complet</SelectItem>
                  <SelectItem value="with_issues">Avec Problèmes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer Réception"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/receptions">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
