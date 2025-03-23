import { buttonVariants, Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="sm:container mx-auto flex max-w-2xl flex-col items-center space-y-8 text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-4xl font-semibold">
          Oops! Page Not Found
        </h2>
        <p className="text-xl text-muted-foreground max-w-lg">
          It seems you&apos;ve ventured into uncharted territory. The page
          you&apos;re looking for doesn&apos;t exist or has been moved to a new
          dimension.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
          >
            <Link href="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#contact">Contact Support</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
