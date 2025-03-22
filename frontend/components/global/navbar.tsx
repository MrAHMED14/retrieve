import { Button } from "@/components/ui/button"
import { BookText, FileText, Search } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  return (
    <header className="">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6" />
          <span>Document Search</span>
        </Link>

        <nav className="ml-auto flex gap-2">
          <ThemeToggle />
          <Link href="/#search" >
            <Button variant="ghost" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </Link>
          <Link href="/documents">
            <Button variant="ghost" className="flex items-center gap-2">
              <BookText className="h-4 w-4" /> 
              <span>Library</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

