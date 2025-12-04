import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Package, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="font-bold text-xl">Procurement Manager</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Complete Procurement Management Solution
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Streamline your entire supply chain from project initiation to invoice processing with our comprehensive
              procurement platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-24 bg-muted/50">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Inventory Management</h3>
                <p className="text-muted-foreground">
                  Track stock levels, manage products, and automate reordering with real-time inventory visibility.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Quality Control</h3>
                <p className="text-muted-foreground">
                  Ensure product quality with integrated inspection workflows and compliance tracking.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Full Workflow</h3>
                <p className="text-muted-foreground">
                  From project creation to ERP integration, manage your entire procurement lifecycle.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 Procurement Manager. Built with Next.js and Supabase.
        </div>
      </footer>
    </div>
  )
}
