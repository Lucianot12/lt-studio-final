"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Settings, Eye, ImageIcon, Video, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  type: "image" | "video"
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState("")
  const [selectedProject, setSelectedProject] = useState<number>(2)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("lt_admin_auth")
      const user = localStorage.getItem("lt_admin_user")
      const timestamp = localStorage.getItem("lt_admin_timestamp")

      if (auth === "authenticated" && user && timestamp) {
        // Verificar si la sesión no ha expirado (24 horas)
        const sessionAge = Date.now() - Number.parseInt(timestamp)
        const maxAge = 24 * 60 * 60 * 1000 // 24 horas

        if (sessionAge < maxAge) {
          setIsAuthenticated(true)
          setCurrentUser(user)
        } else {
          // Sesión expirada
          handleLogout()
        }
      } else {
        router.push("/admin/login")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("lt_admin_auth")
    localStorage.removeItem("lt_admin_user")
    localStorage.removeItem("lt_admin_timestamp")
    router.push("/admin/login")
  }

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

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
    )

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
      type: file.type.startsWith("image/") ? "image" : "video",
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

  const clearAllFiles = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview))
    setFiles([])
  }

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="text-lg font-light tracking-wide">VERIFYING ACCESS...</span>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (se redirige)
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
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
                <Eye size={18} />
                <span className="text-sm tracking-wide">VIEW SITE</span>
              </Link>

              <div className="text-xl font-light tracking-wider flex items-center space-x-2">
                <Shield size={20} />
                <span>LT ADMIN</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/60">Welcome, {currentUser}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors text-sm"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </nav>

        <div className="pt-32 pb-20 px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-thin tracking-wide mb-6">CONTENT MANAGEMENT</h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Gestiona el contenido de tus proyectos arquitectónicos. Sube imágenes y videos de forma profesional.
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex bg-white/5 rounded-full p-2 border border-white/10">
                <button
                  className={`px-8 py-3 rounded-full transition-all ${
                    activeTab === "upload" ? "bg-white/20 text-white" : "text-white/60 hover:text-white/80"
                  }`}
                  onClick={() => setActiveTab("upload")}
                >
                  <Upload size={18} className="inline mr-2" />
                  Upload Content
                </button>
                <button
                  className={`px-8 py-3 rounded-full transition-all ${
                    activeTab === "manage" ? "bg-white/20 text-white" : "text-white/60 hover:text-white/80"
                  }`}
                  onClick={() => setActiveTab("manage")}
                >
                  <Settings size={18} className="inline mr-2" />
                  Manage Projects
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
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

                  {/* Upload Controls */}
                  <motion.div
                    className="mb-8 flex justify-center space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <motion.button
                      className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ImageIcon size={18} />
                      <span>Add Images</span>
                    </motion.button>

                    <motion.button
                      className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2"
                      onClick={() => videoInputRef.current?.click()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Video size={18} />
                      <span>Add Videos</span>
                    </motion.button>
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
                      <motion.div animate={{ scale: isDragging ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                        <Upload size={48} className="mx-auto mb-6 text-white/60" />
                        <h3 className="text-xl font-light mb-4">
                          {isDragging ? "Drop files here" : "Upload Project Content"}
                        </h3>
                        <p className="text-white/60 mb-6">
                          Drag and drop images or videos here, or use the buttons above
                        </p>
                        <div className="text-sm text-white/40">
                          Supported: JPG, PNG, WebP, MP4, MOV • Max: 50MB per file
                        </div>
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
                          <div className="flex space-x-4">
                            <motion.button
                              className="px-6 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
                              onClick={uploadAllFiles}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={files.every((f) => f.status !== "pending")}
                            >
                              Upload All
                            </motion.button>
                            <motion.button
                              className="px-6 py-2 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                              onClick={clearAllFiles}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Clear All
                            </motion.button>
                          </div>
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
                              {/* File Preview */}
                              <div className="aspect-video relative overflow-hidden">
                                {file.type === "image" ? (
                                  <img
                                    src={file.preview || "/placeholder.svg"}
                                    alt={file.file.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video src={file.preview} className="w-full h-full object-cover" muted />
                                )}

                                {/* Type Badge */}
                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs">
                                  {file.type === "image" ? (
                                    <ImageIcon size={12} className="inline mr-1" />
                                  ) : (
                                    <Video size={12} className="inline mr-1" />
                                  )}
                                  {file.type.toUpperCase()}
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                  {file.status === "pending" && (
                                    <div className="px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs">
                                      PENDING
                                    </div>
                                  )}
                                  {file.status === "uploading" && (
                                    <div className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs flex items-center space-x-1">
                                      <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                      <span>UPLOADING</span>
                                    </div>
                                  )}
                                  {file.status === "success" && (
                                    <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                                      SUCCESS
                                    </div>
                                  )}
                                  {file.status === "error" && (
                                    <div className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs">
                                      ERROR
                                    </div>
                                  )}
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFile(index)}
                                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  ×
                                </button>
                              </div>

                              {/* File Info */}
                              <div className="p-4">
                                <div className="text-sm font-light truncate mb-1">{file.file.name}</div>
                                <div className="text-xs text-white/60">
                                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                </div>

                                {file.status === "pending" && (
                                  <motion.button
                                    className="mt-3 w-full py-2 px-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-sm"
                                    onClick={() => uploadFile(index)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    Upload
                                  </motion.button>
                                )}

                                {file.status === "success" && file.url && (
                                  <div className="mt-3">
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block w-full py-2 px-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm text-center"
                                    >
                                      View File
                                    </a>
                                  </div>
                                )}

                                {file.status === "error" && (
                                  <div className="mt-3">
                                    <div className="text-xs text-red-400 mb-2">{file.error}</div>
                                    <motion.button
                                      className="w-full py-2 px-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                                      onClick={() => uploadFile(index)}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      Retry
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === "manage" && (
                <motion.div
                  key="manage"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <Settings size={64} className="mx-auto mb-6 text-white/40" />
                  <h3 className="text-2xl font-light mb-4">Project Management</h3>
                  <p className="text-white/60 max-w-md mx-auto">
                    Advanced project management features coming soon. Currently you can upload and organize content by
                    project.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
