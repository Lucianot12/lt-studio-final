"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Play, X } from "lucide-react"
import { useState, useEffect } from "react"

const projectDetails = {
  1: {
    name: "PARK MANSION",
    category: "Luxury Residential",
    description:
      "Una residencia de lujo que redefine la vida moderna con espacios amplios, materiales premium y una integración perfecta con el paisaje circundante. Cada detalle ha sido cuidadosamente diseñado para crear una experiencia habitacional única.",
    year: "2024",
    client: "Private Client",
    location: "Roppongi, Tokyo",
    area: "850 m²",
    services: ["Architectural Design", "Interior Design", "Landscape Design", "3D Visualization"],
    images: [
      "/images/park-mansion-1.jpg", // Comedor moderno
      "/images/park-mansion-2.jpg", // Fachada nocturna
      "/images/park-mansion-3.jpg", // Sala de estar
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "architectural_walkthrough",
        title: "Architectural Walkthrough",
        thumbnail: "/images/park-mansion-1.jpg",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "interior_showcase",
        title: "Interior Design Showcase",
        thumbnail: "/images/park-mansion-3.jpg",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  2: {
    name: "AZURE TOWER",
    category: "High-Rise Commercial",
    description:
      "Un rascacielos comercial que combina funcionalidad y estética, creando un nuevo hito en el skyline urbano. Su diseño innovador maximiza la eficiencia energética mientras ofrece espacios de trabajo inspiradores.",
    year: "2024",
    client: "Azure Development Corp",
    location: "Shibuya, Tokyo",
    area: "12,500 m²",
    services: ["Architectural Design", "Structural Engineering", "MEP Design", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "architectural_walkthrough",
        title: "Tower Design Overview",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "construction_timelapse",
        title: "Construction Timelapse",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  3: {
    name: "MINIMALIST VILLA",
    category: "Private Residence",
    description:
      "Una villa que abraza la filosofía minimalista, donde cada elemento tiene un propósito y la simplicidad se convierte en sofisticación. Los espacios fluidos y la conexión con la naturaleza definen esta obra maestra.",
    year: "2024",
    client: "Yamamoto Family",
    location: "Kamakura, Japan",
    area: "420 m²",
    services: ["Architectural Design", "Interior Design", "Garden Design", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "architectural_walkthrough",
        title: "Minimalist Design Philosophy",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "lifestyle_showcase",
        title: "Living in Harmony",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  4: {
    name: "URBAN LOFT",
    category: "Interior Design",
    description:
      "La transformación de un espacio industrial en un loft urbano contemporáneo que celebra la historia del edificio mientras abraza la modernidad. Materiales auténticos y diseño inteligente crean un hogar único.",
    year: "2024",
    client: "Creative Professional",
    location: "Harajuku, Tokyo",
    area: "180 m²",
    services: ["Interior Design", "Space Planning", "Custom Furniture", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "interior_showcase",
        title: "Industrial Chic Design",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "before_after",
        title: "Transformation Story",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  5: {
    name: "GLASS PAVILION",
    category: "Commercial Space",
    description:
      "Un pabellón de cristal que desafía las convenciones arquitectónicas, creando un espacio comercial que se integra armoniosamente con su entorno mientras ofrece una experiencia única a los visitantes.",
    year: "2024",
    client: "Retail Innovation Group",
    location: "Ginza, Tokyo",
    area: "650 m²",
    services: ["Architectural Design", "Structural Engineering", "Lighting Design", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "architectural_walkthrough",
        title: "Transparent Architecture",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "lighting_showcase",
        title: "Light and Shadow Play",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  6: {
    name: "CONCRETE HOUSE",
    category: "Modern Architecture",
    description:
      "Una exploración audaz del hormigón como material expresivo, creando una residencia que combina la brutalidad del material con la calidez del hogar. Geometrías puras y espacios dramáticos definen esta obra.",
    year: "2024",
    client: "Architecture Enthusiast",
    location: "Meguro, Tokyo",
    area: "320 m²",
    services: ["Architectural Design", "Structural Design", "Interior Design", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "architectural_walkthrough",
        title: "Concrete Poetry",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "material_showcase",
        title: "The Beauty of Concrete",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  7: {
    name: "ROOFTOP GARDEN",
    category: "Landscape Design",
    description:
      "Un jardín en las alturas que transforma un espacio urbano en un oasis verde. La integración de arquitectura paisajística y diseño sostenible crea un refugio natural en el corazón de la ciudad.",
    year: "2024",
    client: "Urban Development Corp",
    location: "Shinjuku, Tokyo",
    area: "1,200 m²",
    services: ["Landscape Design", "Irrigation Systems", "Sustainable Design", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "landscape_showcase",
        title: "Urban Oasis Design",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "sustainability_focus",
        title: "Green Building Solutions",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
  8: {
    name: "SPIRAL TOWER",
    category: "Architectural Innovation",
    description:
      "Una torre que desafía la gravedad con su forma espiral, representando la evolución de la arquitectura contemporánea. Su diseño innovador no solo es visualmente impactante, sino también funcionalmente superior.",
    year: "2024",
    client: "Future Architecture Foundation",
    location: "Odaiba, Tokyo",
    area: "8,500 m²",
    services: ["Architectural Design", "Parametric Design", "Structural Innovation", "3D Visualization"],
    images: [
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
      "/placeholder.svg?height=800&width=1200",
    ],
    videos: [
      {
        type: "architectural_walkthrough",
        title: "Spiral Architecture Innovation",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        type: "engineering_showcase",
        title: "Structural Engineering Marvel",
        thumbnail: "/placeholder.svg?height=600&width=800",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  },
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const project = projectDetails[Number.parseInt(params.id) as keyof typeof projectDetails] || projectDetails[1]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMoving(true)

      const timer = setTimeout(() => {
        setIsMoving(false)
      }, 100)

      return () => clearTimeout(timer)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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

      <div className="min-h-screen bg-zinc-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-30 p-8">
          <motion.div
            className="backdrop-blur-md bg-zinc-900/80 rounded-full px-6 py-3 border border-white/10"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-3 hover:text-zinc-400 transition-colors group">
                <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
                  <ArrowLeft size={18} />
                </motion.div>
                <span className="text-sm tracking-wide">BACK TO PROJECTS</span>
              </Link>
              <div className="text-xl font-light tracking-wider">LT STUDIO</div>
            </div>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <motion.div
          className="relative h-screen flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${project.images[0]})`,
              filter: "brightness(0.4)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-sm tracking-[0.3em] text-white/60 uppercase">{project.category}</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-thin tracking-wide mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {project.name}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {project.description}
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="w-px h-16 bg-white/30 mx-auto mb-4" />
              <span className="text-xs tracking-[0.2em] text-white/50 uppercase">Scroll to explore</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Project Details */}
        <div className="px-8 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Project Info Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-xs tracking-[0.3em] text-zinc-500 mb-3 uppercase">Client</h3>
                <p className="text-lg font-light">{project.client}</p>
              </div>
              <div>
                <h3 className="text-xs tracking-[0.3em] text-zinc-500 mb-3 uppercase">Year</h3>
                <p className="text-lg font-light">{project.year}</p>
              </div>
              <div>
                <h3 className="text-xs tracking-[0.3em] text-zinc-500 mb-3 uppercase">Location</h3>
                <p className="text-lg font-light">{project.location}</p>
              </div>
              <div>
                <h3 className="text-xs tracking-[0.3em] text-zinc-500 mb-3 uppercase">Area</h3>
                <p className="text-lg font-light">{project.area}</p>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs tracking-[0.3em] text-zinc-500 mb-6 uppercase">Services</h3>
              <div className="flex flex-wrap gap-4">
                {project.services.map((service, index) => (
                  <motion.span
                    key={index}
                    className="px-6 py-3 text-sm tracking-wide rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {service}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Videos Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-light tracking-wide mb-12">Project Videos</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {project.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="group relative aspect-video rounded-2xl overflow-hidden bg-zinc-800/50 border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedVideo(index)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play size={24} className="text-white ml-1" />
                      </motion.div>
                    </div>

                    {/* Video Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="text-lg font-light tracking-wide text-white">{video.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Images Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-light tracking-wide mb-12">Project Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800/50 border border-white/10"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${project.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Image Number */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xs text-white font-light">{index + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Project Navigation */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col space-y-4">
            {/* Previous Project */}
            {Number.parseInt(params.id) > 1 && (
              <Link href={`/project/${Number.parseInt(params.id) - 1}`}>
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <ArrowLeft size={20} className="text-white group-hover:text-white/80" />
                </motion.div>
              </Link>
            )}

            {/* Next Project */}
            {Number.parseInt(params.id) < 8 && (
              <Link href={`/project/${Number.parseInt(params.id) + 1}`}>
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <ArrowLeft size={20} className="text-white group-hover:text-white/80 rotate-180" />
                </motion.div>
              </Link>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-20 px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 text-lg tracking-wide hover:text-zinc-400 transition-colors group"
            >
              <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
                <ArrowLeft size={20} />
              </motion.div>
              <span>BACK TO ALL PROJECTS</span>
            </Link>
          </div>
        </footer>

        {/* Image Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-6xl max-h-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={project.images[selectedImage] || "/placeholder.svg"}
                  alt={`${project.name} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Navigation */}
                {selectedImage > 0 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ArrowLeft size={20} className="text-white" />
                  </button>
                )}

                {selectedImage < project.images.length - 1 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ArrowLeft size={20} className="text-white rotate-180" />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
                  <span className="text-sm text-white">
                    {selectedImage + 1} / {project.images.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Lightbox */}
        <AnimatePresence>
          {selectedVideo !== null && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                className="relative w-full max-w-6xl aspect-video"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={project.videos[selectedVideo].url}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Video Title */}
                <div className="absolute -bottom-12 left-0">
                  <h4 className="text-lg font-light tracking-wide text-white">{project.videos[selectedVideo].title}</h4>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Cursor */}
        <motion.div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: 0,
            top: 0,
          }}
          animate={{
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
          }}
          transition={{
            type: "spring",
            stiffness: 1000,
            damping: 50,
            mass: 0.1,
          }}
        >
          <motion.div
            className="relative w-10 h-10"
            animate={{
              scale: isHovering ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/60"
              animate={{
                scale: isMoving ? [1, 1.2, 1] : 1,
                opacity: isMoving ? 0.8 : 0.6,
              }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: "0 0 20px rgba(255,255,255,0.3)",
              }}
            />

            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
              style={{
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              }}
              animate={{
                scale: isHovering ? 1.5 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
