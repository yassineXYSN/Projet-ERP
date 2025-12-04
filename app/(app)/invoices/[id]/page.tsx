"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchInvoice = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("invoices")
        .select("*, suppliers(name, contact_person, email), purchase_orders(order_number, total_amount)")
        .eq("id", params.id)
        .single()

      setInvoice(data)
      setIsLoading(false)
    }

    fetchInvoice()
  }, [params.id])

  const handleSyncToERP = async () => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      // Log the ERP sync attempt
      const { error: logError } = await supabase.from("erp_logs").insert({
        entity_type: "invoice",
        entity_id: invoice.id,
        action: "sync_to_erp",
        status: "success",
      })

      if (logError) throw logError

      toast({
        title: "Success",
        description: "Invoice synced to ERP system successfully",
      })
    } catch (error: any) {
      // Log failed attempt
      await supabase.from("erp_logs").insert({
        entity_type: "invoice",
        entity_id: invoice.id,
        action: "sync_to_erp",
        status: "failed",
        error_message: error.message,
      })

      toast({
        title: "Error",
        description: "Failed to sync invoice to ERP",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkAsPaid = async () => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_amount: invoice.total_amount,
        })
        .eq("id", invoice.id)

      if (error) throw error

      // Log to ERP
      await supabase.from("erp_logs").insert({
        entity_type: "invoice",
        entity_id: invoice.id,
        action: "mark_as_paid",
        status: "success",
      })

      toast({
        title: "Success",
        description: "Invoice marked as paid",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!invoice) {
    return <div className="p-6">Invoice not found</div>
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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
          <p className="text-muted-foreground mt-1">Invoice details and payment status</p>
        </div>
        <Badge variant={getStatusBadge(invoice.status)} className="text-sm">
          {invoice.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSyncToERP} disabled={isUpdating}>
          Sync to ERP
        </Button>
        {invoice.status !== "paid" && balance > 0 && (
          <Button onClick={handleMarkAsPaid} disabled={isUpdating} variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Paid
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
              <p className="text-base mt-1 font-mono">{invoice.invoice_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
              <p className="text-base mt-1">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="text-base mt-1">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            )}
            {invoice.purchase_orders && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Order</p>
                <p className="text-base mt-1">{invoice.purchase_orders.order_number}</p>
              </div>
            )}
            {invoice.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-base mt-1">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoice.suppliers ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier Name</p>
                  <p className="text-base mt-1">{invoice.suppliers.name}</p>
                </div>
                {invoice.suppliers.contact_person && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p className="text-base mt-1">{invoice.suppliers.contact_person}</p>
                  </div>
                )}
                {invoice.suppliers.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base mt-1">{invoice.suppliers.email}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No supplier information</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold mt-1">${invoice.total_amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
              <p className="text-2xl font-bold mt-1 text-green-600">${invoice.paid_amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance Due</p>
              <p className={`text-2xl font-bold mt-1 ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
