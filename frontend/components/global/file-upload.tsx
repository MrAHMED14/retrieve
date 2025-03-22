"use client"

import type React from "react"

import { useState } from "react"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress" 
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function FileUpload() {
  const router = useRouter()
  
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)  

  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle") 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      const validFiles = fileList.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "text/plain" ||
          file.name.endsWith(".pdf") ||
          file.name.endsWith(".txt"),
      )

      if (validFiles.length !== fileList.length) {
        toast.error("Invalid file type",{
          description: "Only PDF and TXT files are supported.",
        })
      }

      setFiles(validFiles)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setUploadStatus("idle")

    try {
      const progressInterval = simulateProgress()

      const formData = new FormData()

      for (const file of files) {
        formData.append("file", file)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://127.0.0.1:5000"}/upload`, {
        method: "POST",
        body: formData, 
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      setUploadStatus("success") 

      toast.success("Upload successful",{
        description: `${files.length} document(s) have been indexed.`,
      })

      router.push("/documents")
      setFiles([])
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error") 

      toast.error("Upload failed",{
        description: "There was an error processing your documents.",
      })
    } finally {
      setUploading(false)
    }
  }

  const simulateProgress = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      if (currentProgress > 95) {
        currentProgress = 95  
      }
      setProgress(currentProgress)
    }, 200)
    return interval
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.txt,application/pdf,text/plain"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
          <p className="text-xs text-muted-foreground">Supports PDF and TXT files (max 10MB each)</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-center text-muted-foreground">Processing documents... {progress}%</p>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Documents successfully indexed</span>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Error processing documents</span>
        </div>
      )}

      <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="w-full">
        {uploading ? "Processing..." : "Upload and Index Documents"}
      </Button>
    </div>
  )
}

