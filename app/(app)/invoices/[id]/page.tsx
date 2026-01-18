import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, FileText, Banknote } from "lucide-react"
import Link from "next/link"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // If id is "new", redirect to the new invoice page
  if (id === "new") {
    redirect("/invoices/new")
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    notFound()
  }

  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, suppliers(name, email, phone), purchase_orders(order_number)")
    .eq("id", id)
    .single()

  if (error || !invoice) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      pending_validation: "outline",
      validated: "default",
      paid: "default",
      disputed: "destructive",
      cancelled: "destructive",
    }
    return variants[status] || "outline"
  }

  const balance = invoice.total_amount - invoice.paid_amount

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
            <Badge variant={getStatusBadge(invoice.status)}>
              {invoice.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Facture fournisseur</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations de la facture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Numero de facture</p>
                <p className="font-medium">{invoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bon de commande</p>
                <p className="font-medium">{invoice.purchase_orders?.order_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de facture</p>
                <p className="font-medium">{new Date(invoice.invoice_date).toLocaleDateString("fr-TN")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'echeance</p>
                <p className="font-medium">
                  {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("fr-TN") : "N/A"}
                </p>
              </div>
            </div>
            {invoice.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="mt-1">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Fournisseur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoice.suppliers ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{invoice.suppliers.name}</p>
                </div>
                {invoice.suppliers.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{invoice.suppliers.email}</p>
                  </div>
                )}
                {invoice.suppliers.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telephone</p>
                    <p className="font-medium">{invoice.suppliers.phone}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Aucun fournisseur associe</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Montants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Montant total</p>
                <p className="text-2xl font-bold">{invoice.total_amount.toFixed(2)} DT</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Montant paye</p>
                <p className="text-2xl font-bold text-green-600">{invoice.paid_amount.toFixed(2)} DT</p>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Solde restant</p>
                <p className="text-2xl font-bold text-orange-600">{balance.toFixed(2)} DT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/invoices">Retour a la liste</Link>
        </Button>
      </div>
    </div>
  )
}
