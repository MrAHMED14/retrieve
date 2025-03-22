import { Button } from "@/components/ui/button"
import { BookText, FileText, Search } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  return (
    <header className="">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
        <svg className="h-6 w-6 dark:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v24h24V0H0zm11.52 21.89l-1.33-2.54H8.4v2.54H6v-9.2h4.13c2.44 0 3.83 1.19 3.83 3.24 0 1.39-.58 2.4-1.64 2.96l1.92 3h-2.72zm11.36 0H15.5v-9.2h7.24v1.92H17.9v1.72h4.38v1.9l-4.38.01v1.73h4.99v1.92zM11.68 16c0 .93-.56 1.43-1.53 1.43H8.4v-2.82h1.75c.97 0 1.53.49 1.53 1.4z"/></svg>
          <span>Retrieve</span>
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

