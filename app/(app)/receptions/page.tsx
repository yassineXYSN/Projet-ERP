"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Reception {
  id: string
  reception_number: string
  purchase_order_id: string
  reception_date: string
  status: string
}

export default function ReceptionsPage() {
  const [receptions, setReceptions] = useState<Reception[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReceptions = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("receptions")
        .select("*")
        .order("reception_date", { ascending: false })

      if (data) setReceptions(data)
      if (error) console.error("Error fetching receptions:", error)
      setIsLoading(false)
    }

    fetchReceptions()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réceptions</h1>
          <p className="text-muted-foreground mt-1">Gérer les réceptions de marchandises</p>
        </div>
        <Button asChild>
          <Link href="/receptions/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Réception
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Réceptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : receptions.length === 0 ? (
            <p className="text-muted-foreground">Aucune réception trouvée</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date de Réception</TableHead>
                    <TableHead>Bon de Commande</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receptions.map((reception) => (
                    <TableRow key={reception.id}>
                      <TableCell className="font-medium">{reception.reception_number}</TableCell>
                      <TableCell>{new Date(reception.reception_date).toLocaleDateString()}</TableCell>
                      <TableCell>{reception.purchase_order_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reception.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
