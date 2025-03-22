import { FileUpload } from "@/components/global/file-upload";
import { SearchBar } from "@/components/global/search-bar";
import { SearchResults } from "@/components/global/search-results";

 
export default function Home() {
  return (
    <main className="container mx-auto py-20 px-4 max-w-5xl">
      <h1 className="text-4xl font-bold text-center">Unlock Knowledge at Your Fingertips</h1>
      <h4 className="text-xl font-semibold mb-10 text-center text-muted-foreground">Information Retrieval System</h4>

      <div className="grid gap-8">
        <section className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <p className="text-muted-foreground mb-4">Upload PDF or TXT files to add them to the search index.</p>
          <FileUpload />
        </section>

        <section className="bg-card rounded-lg p-6 shadow-sm" id="search">
          <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
          <p className="text-muted-foreground mb-4">
            Search through your uploaded documents using keywords or phrases.
          </p>
          <SearchBar />
          <SearchResults />
        </section>
      </div>
    </main>
  )
}

