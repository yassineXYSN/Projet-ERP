import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function QualityPage() {
  const supabase = await createClient()

  const { data: qualityChecks } = await supabase
    .from("quality_checks")
    .select("*, receptions(reception_number), products(name), profiles(full_name)")
    .order("checked_at", { ascending: false })

  const getResultBadge = (result: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      passed: "default",
      failed: "destructive",
      conditional: "outline",
    }
    return variants[result] || "outline"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground mt-1">Track and manage quality inspections</p>
        </div>
        <Button asChild>
          <Link href="/quality/new">
            <Plus className="mr-2 h-4 w-4" />
            New Inspection
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reception</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Check Type</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityChecks && qualityChecks.length > 0 ? (
                qualityChecks.map((check: any) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">{check.receptions?.reception_number || "N/A"}</TableCell>
                    <TableCell>{check.products?.name || "N/A"}</TableCell>
                    <TableCell>{check.check_type}</TableCell>
                    <TableCell>{check.profiles?.full_name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant={getResultBadge(check.result)}>{check.result}</Badge>
                    </TableCell>
                    <TableCell>{new Date(check.checked_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/quality/${check.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No quality checks found. Create your first inspection to get started.
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
