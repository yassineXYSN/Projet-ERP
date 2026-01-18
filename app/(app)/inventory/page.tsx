import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function InventoryPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, suppliers(name)")
    .order("name", { ascending: true })

  const lowStockProducts = products?.filter((p) => p.quantity_in_stock <= p.reorder_level)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaire</h1>
          <p className="text-muted-foreground mt-1">Gérer les produits et niveaux de stock</p>
        </div>
        <Button asChild>
          <Link href="/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Produit
          </Link>
        </Button>
      </div>

      {lowStockProducts && lowStockProducts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alerte Stock Bas</AlertTitle>
          <AlertDescription>
            {lowStockProducts.length} produit{lowStockProducts.length > 1 ? "s" : ""}{" "}
            {lowStockProducts.length > 1 ? "sont" : "est"} au niveau de réapprovisionnement ou en dessous.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tous les Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead className="text-right">Prix Unitaire</TableHead>
                <TableHead className="text-right">En Stock</TableHead>
                <TableHead className="text-right">Seuil Réappro</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product: any) => {
                  const isLowStock = product.quantity_in_stock <= product.reorder_level
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category || "-"}</TableCell>
                      <TableCell>{product.suppliers?.name || "-"}</TableCell>
                      <TableCell className="text-right">{product.unit_price.toFixed(2)} DT</TableCell>
                      <TableCell className="text-right">{product.quantity_in_stock}</TableCell>
                      <TableCell className="text-right">{product.reorder_level}</TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive">Stock Bas</Badge>
                        ) : (
                          <Badge variant="default">En Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/inventory/${product.id}`}>Voir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Aucun produit trouvé. Ajoutez votre premier produit pour commencer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
