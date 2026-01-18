import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Building2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, suppliers(id, name, phone, email)")
    .eq("id", id)
    .single()

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
          <p className="text-muted-foreground mt-1">Détails du produit et statut de l'inventaire</p>
        </div>
        {isLowStock ? <Badge variant="destructive">Stock Bas</Badge> : <Badge variant="default">En Stock</Badge>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations Produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">SKU</p>
              <p className="text-base mt-1 font-mono">{product.sku}</p>
            </div>
            {product.category && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
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
              <p className="text-sm font-medium text-muted-foreground">Prix Unitaire</p>
              <p className="text-2xl font-bold mt-1">{product.unit_price.toFixed(2)} DT</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut Inventaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quantité en Stock</p>
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold">{product.quantity_in_stock}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Seuil de Réapprovisionnement</p>
              <p className="text-base mt-1">{product.reorder_level}</p>
            </div>
            {isLowStock && (
              <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                <p className="text-sm font-medium text-destructive">
                  Le niveau de stock est au seuil de réapprovisionnement ou en dessous. Envisagez de passer une nouvelle
                  commande.
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de Création</p>
              <p className="text-base mt-1">{new Date(product.created_at).toLocaleDateString("fr-TN")}</p>
            </div>
          </CardContent>
        </Card>

        {product.suppliers && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Fournisseur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <Link
                    href={`/suppliers/${product.suppliers.id}`}
                    className="text-base mt-1 text-primary hover:underline"
                  >
                    {product.suppliers.name}
                  </Link>
                </div>
                {product.suppliers.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-base mt-1">{product.suppliers.phone}</p>
                  </div>
                )}
                {product.suppliers.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base mt-1">{product.suppliers.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
