"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { upload } from "@vercel/blob/client"

const projects = [
  { id: 1, name: "PARK MANSION", category: "Luxury Residential" },
  { id: 2, name: "AZURE TOWER", category: "High-Rise Commercial" },
  { id: 3, name: "MINIMALIST VILLA", category: "Private Residence" },
  { id: 4, name: "URBAN LOFT", category: "Interior Design" },
  { id: 5, name: "GLASS PAVILION", category: "Commercial Space" },
  { id: 6, name: "CONCRETE HOUSE", category: "Modern Architecture" },
  { id: 7, name: "ROOFTOP GARDEN", category: "Landscape Design" },
  { id: 8, name: "SPIRAL TOWER", category: "Architectural Innovation" },
]

interface UploadedFile {
  file: File
  preview: string
  status: "pending" | "uploading" | "success" | "error"
  url?: string
  error?: string
}

export default function UploadPage() {
  const [selectedProject, setSelectedProject] = useState<number>(2) // Default to Azure Tower
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }))

    setFiles((prev) => [...prev, ...uploadFiles])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const uploadFile = async (index: number) => {
    const fileToUpload = files[index]
    if (!fileToUpload || fileToUpload.status === "uploading") return

    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "uploading" } : f)))

    try {
      const projectName =
        projects
          .find((p) => p.id === selectedProject)
          ?.name.toLowerCase()
          .replace(/\s+/g, "-") || "unknown"
      const timestamp = Date.now()
      const filename = `${projectName}-${timestamp}-${fileToUpload.file.name}`

      const blob = await upload(filename, fileToUpload.file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })

      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "success", url: blob.url } : f)))

      // Here you could also save to a database or update project data
      console.log("File uploaded successfully:", blob.url)
    } catch (error) {
      console.error("Upload failed:", error)
      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "error", error: "Upload failed" } : f)))
    }
  }

  const uploadAllFiles = async () => {
    const pendingFiles = files.map((file, index) => ({ file, index })).filter(({ file }) => file.status === "pending")

    for (const { index } of pendingFiles) {
      await uploadFile(index)
    }
  }

  return (
    <>
      {/* CSS Global para ocultar cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        html, body {
          cursor: none !important;
        }
        *:hover {
          cursor: none !important;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-30 p-8">
          <motion.div
            className="backdrop-blur-md bg-black/80 rounded-full px-6 py-3 border border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-3 hover:text-zinc-400 transition-colors">
                <span className="text-sm tracking-wide">← BACK TO STUDIO</span>
              </Link>
              <div className="text-xl font-light tracking-wider">LT UPLOAD</div>
            </div>
          </motion.div>
        </nav>

        <div className="pt-32 pb-20 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-thin tracking-wide mb-6">PROJECT UPLOAD</h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Upload images for your architectural projects. Drag and drop or click to select files.
              </p>
            </motion.div>

            {/* Project Selection */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-lg font-light mb-6 tracking-wide">Select Project</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projects.map((project) => (
                  <motion.button
                    key={project.id}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedProject === project.id
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    onClick={() => setSelectedProject(project.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-light tracking-wide">{project.name}</div>
                    <div className="text-xs text-white/60 mt-1">{project.category}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Upload Area */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging ? "border-white/60 bg-white/10" : "border-white/20 bg-white/5 hover:border-white/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <motion.div animate={{ scale: isDragging ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                  <Upload size={48} className="mx-auto mb-6 text-white/60" />
                  <h3 className="text-xl font-light mb-4">
                    {isDragging ? "Drop images here" : "Upload Project Images"}
                  </h3>
                  <p className="text-white/60 mb-6">Drag and drop your images here, or click to browse</p>
                  <motion.button
                    className="px-8 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Files
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* File List */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-light tracking-wide">Selected Files ({files.length})</h3>
                    <motion.button
                      className="px-6 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                      onClick={uploadAllFiles}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={files.every((f) => f.status !== "pending")}
                    >
                      Upload All
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                        {/* Image Preview */}
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Status Overlay */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            {file.status === "pending" && (
                              <motion.button
                                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                                onClick={() => uploadFile(index)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Upload size={20} className="text-white" />
                              </motion.button>
                            )}

                            {file.status === "uploading" && (
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 size={20} className="text-white animate-spin" />
                              </div>
                            )}

                            {file.status === "success" && (
                              <div className="w-12 h-12 rounded-full bg-green-500/80 backdrop-blur-sm flex items-center justify-center">
                                <Check size={20} className="text-white" />
                              </div>
                            )}

                            {file.status === "error" && (
                              <div className="w-12 h-12 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center">
                                <X size={20} className="text-white" />
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                            onClick={() => removeFile(index)}
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </div>

                        {/* File Info */}
                        <div className="p-4">
                          <div className="text-sm font-light truncate mb-1">{file.file.name}</div>
                          <div className="text-xs text-white/60">{(file.file.size / 1024 / 1024).toFixed(2)} MB</div>

                          {file.status === "success" && file.url && (
                            <div className="mt-2">
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-400 hover:text-green-300 transition-colors"
                              >
                                View uploaded file →
                              </a>
                            </div>
                          )}

                          {file.status === "error" && (
                            <div className="mt-2 text-xs text-red-400">{file.error || "Upload failed"}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <motion.div
              className="text-center text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-sm">Supported formats: JPG, PNG, WebP • Max file size: 10MB per image</p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
