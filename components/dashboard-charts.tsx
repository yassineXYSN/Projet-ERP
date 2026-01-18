"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface DashboardChartsProps {
  orderStatusData: { name: string; value: number; fill: string }[]
  qualityData: { name: string; value: number; fill: string }[]
  financialData: { name: string; value: number }[]
  totalSuppliers: number
  totalProducts: number
}

const orderChartConfig = {
  value: {
    label: "Orders",
  },
  Delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))",
  },
  Approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  Submitted: {
    label: "Submitted",
    color: "hsl(var(--chart-3))",
  },
  Draft: {
    label: "Draft",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const qualityChartConfig = {
  value: {
    label: "Checks",
  },
  Passed: {
    label: "Passed",
    color: "hsl(142, 76%, 36%)",
  },
  Failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)",
  },
  Conditional: {
    label: "Conditional",
    color: "hsl(45, 93%, 47%)",
  },
} satisfies ChartConfig

const financialChartConfig = {
  value: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function DashboardCharts({
  orderStatusData,
  qualityData,
  financialData,
  totalSuppliers,
  totalProducts,
}: DashboardChartsProps) {
  const COLORS = [
    "hsl(210, 40%, 20%)",
    "hsl(220, 35%, 25%)",
    "hsl(215, 38%, 22%)",
    "hsl(210, 42%, 18%)",
    "hsl(225, 40%, 24%)",
  ]
  const QUALITY_COLORS = ["hsl(142, 76%, 25%)", "hsl(0, 84%, 35%)", "hsl(45, 93%, 25%)"]

  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.value, 0)
  const totalQuality = qualityData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Order Status Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Order Status Distribution</CardTitle>
          <CardDescription>Breakdown by current status</CardDescription>
        </CardHeader>
        <CardContent>
          {orderStatusData.length > 0 ? (
            <ChartContainer config={orderChartConfig} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    return (
                      <div className="bg-background border border-border rounded-lg p-2">
                        <p className="text-sm font-medium">{payload[0].name}</p>
                        <p className="text-sm">{payload[0].value}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No order data available
            </div>
          )}
          <div className="text-center mt-2">
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
        </CardContent>
      </Card>

      {/* Quality Checks Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quality Control Results</CardTitle>
          <CardDescription>Inspection outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          {qualityData.length > 0 ? (
            <ChartContainer config={qualityChartConfig} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    return (
                      <div className="bg-background border border-border rounded-lg p-2">
                        <p className="text-sm font-medium">{payload[0].name}</p>
                        <p className="text-sm">{payload[0].value}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
                <Pie
                  data={qualityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || QUALITY_COLORS[index % QUALITY_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No quality data available
            </div>
          )}
          <div className="text-center mt-2">
            <p className="text-2xl font-bold">{totalQuality}</p>
            <p className="text-xs text-muted-foreground">Total Inspections</p>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Financial Overview</CardTitle>
          <CardDescription>Orders, invoices & payments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={financialChartConfig} className="h-[220px] w-full">
            <BarChart data={financialData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k DT`} fontSize={10} />
              <YAxis type="category" dataKey="name" width={70} fontSize={10} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [
                  `${value.toLocaleString("fr-TN", { minimumFractionDigits: 2 })} DT`,
                  "Amount",
                ]}
              />
              <Bar dataKey="value" fill="hsl(210, 40%, 20%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2 mt-4 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-lg font-bold">{totalSuppliers}</p>
              <p className="text-xs text-muted-foreground">Suppliers</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-lg font-bold">{totalProducts}</p>
              <p className="text-xs text-muted-foreground">Products</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
