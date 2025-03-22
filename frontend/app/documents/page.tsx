import { DocumentList } from "@/components/global/document-list";

export default function DocumentsPage() {
  return (
    <main className="container mx-auto py-20 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Document Library</h1>

      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
        <p className="text-muted-foreground mb-6">View and manage all your uploaded documents.</p>
        <DocumentList />
      </div>
    </main>
  )
}

