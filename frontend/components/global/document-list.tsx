"use client"

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { File, FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

type DocumentInfo = {
  id: string
  name: string
  fileType: "pdf" | "txt"
  lastModified: string
}

export function DocumentList() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, startTransition] = useTransition()

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://127.0.0.1:5000"}/files`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch documents")
      }

      const data = await response.json()
      setDocuments(data.files)
    } catch (error) {
      console.error("Error fetching documents:", error)

      toast.error("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL ?? "http://127.0.0.1:5000"
          }/file/${id}/delete`,
          {
            method: "DELETE",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to delete document")
        }

        setDocuments(documents.filter((doc) => doc.id !== id))

        toast.success("Document deleted", {
          description: "The document has been removed from the index.",
        })
      } catch (error) {
        console.error("Error deleting document:", error)
        toast.error("Failed to delete document")
      }
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">No documents found</p>
        <Link href="/">
          <Button>Upload Documents</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {doc.fileType === "pdf" ? (
                <File className="h-5 w-5 text-red-500" />
              ) : (
                <FileText className="h-5 w-5 text-blue-500" />
              )}
              <span className="line-clamp-2">{doc.name}</span>
            </CardTitle>
          </CardHeader>
          <CardFooter className="mt-4">
            <Button
              variant="outline"
              disabled={isDeleting}
              size="sm"
              onClick={() => handleDelete(doc.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
