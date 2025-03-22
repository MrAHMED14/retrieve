"use client"

import { CodeXml, Github } from "lucide-react"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear}{" "}
            <Link
              href="https://github.com/mrahmed14"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-white"
            >
              MrAHMED
            </Link>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="https://github.com/MrAHMED14/retrieve"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors duration-300"
                    aria-label="GitHub Repository"
                  >
                    <Github className="h-5 w-5 text-foreground   transition-transform duration-300" />
                    <span className="absolute inset-0 rounded-full border border-muted-foreground/20 scale-0 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-1">
                    <CodeXml className="size-3.5" />
                    <p className="font-medium">Source code</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  )
}
