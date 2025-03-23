import "./globals.css"
import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/global/theme-provider"
import { Navbar } from "@/components/global/navbar"
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/global/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Retrieve",
  description: "Information retrieval system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex flex-col min-h-screen antialiased",
          inter.className
        )}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
