"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
// REMOVIDO: import UploadButton from "@/components/upload-button"

const projects = [
  {
    id: 1,
    name: "PARK MANSION",
    category: "Luxury Residential",
    image: "/images/park-mansion-1.jpg", // Ahora usando la imagen real del comedor
    color: "from-blue-900/40 to-slate-900/40",
  },
  {
    id: 2,
    name: "AZURE TOWER",
    category: "High-Rise Commercial",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-cyan-900/40 to-blue-900/40",
  },
  {
    id: 3,
    name: "MINIMALIST VILLA",
    category: "Private Residence",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-amber-900/40 to-orange-900/40",
  },
  {
    id: 4,
    name: "URBAN LOFT",
    category: "Interior Design",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-green-900/40 to-teal-900/40",
  },
  {
    id: 5,
    name: "GLASS PAVILION",
    category: "Commercial Space",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-purple-900/40 to-pink-900/40",
  },
  {
    id: 6,
    name: "CONCRETE HOUSE",
    category: "Modern Architecture",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-slate-900/40 to-gray-900/40",
  },
  {
    id: 7,
    name: "ROOFTOP GARDEN",
    category: "Landscape Design",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-emerald-900/40 to-green-900/40",
  },
  {
    id: 8,
    name: "SPIRAL TOWER",
    category: "Architectural Innovation",
    image: "/placeholder.svg?height=800&width=1200",
    color: "from-red-900/40 to-pink-900/40",
  },
]

export default function LTStudioDesign() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showMainContent, setShowMainContent] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentProject, setCurrentProject] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const circleRef = useRef<HTMLDivElement>(null)
  const [mouseAngle, setMouseAngle] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [lastMouseAngle, setLastMouseAngle] = useState(0)
  const [autoRotationAngle, setAutoRotationAngle] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  // Auto-rotación cuando no hay interacción
  useEffect(() => {
    if (!isUserInteracting && !isHovering && !isLoading) {
      const interval = setInterval(() => {
        setAutoRotationAngle((prev) => {
          const newAngle = (prev + 0.5) % 360
          const sectionSize = 360 / projects.length
          const projectIndex = Math.floor(newAngle / sectionSize)
          if (projectIndex !== currentProject) {
            setCurrentProject(projectIndex)
          }
          setProgressPercentage((newAngle / 360) * 100)
          return newAngle
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isUserInteracting, isHovering, currentProject, isLoading])

  // Función para cambiar proyecto basado en la posición del mouse
  const updateProjectFromMouse = useCallback(
    (e: MouseEvent) => {
      if (!circleRef.current || !isHovering || isLoading) return

      const rect = circleRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))

      if (distance > 120 && distance < 280) {
        setIsUserInteracting(true)

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
        const degrees = ((angle * 180) / Math.PI + 450) % 360

        const angleDiff = Math.abs(degrees - lastMouseAngle)
        if (angleDiff > 5 || angleDiff > 350) {
          setLastMouseAngle(degrees)
          setMouseAngle(degrees)

          const percentage = (degrees / 360) * 100
          setProgressPercentage(percentage)

          const sectionSize = 360 / projects.length
          const projectIndex = Math.floor(degrees / sectionSize)

          if (projectIndex !== currentProject) {
            setCurrentProject(projectIndex)
          }
        }
      }
    },
    [isHovering, currentProject, lastMouseAngle, isLoading],
  )

  // Manejo global del mouse
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isLoading) {
        setMousePosition({ x: e.clientX, y: e.clientY })
        setIsMoving(true)

        const timer = setTimeout(() => {
          setIsMoving(false)
          setIsUserInteracting(false)
        }, 1000)

        updateProjectFromMouse(e)

        return () => clearTimeout(timer)
      }
    },
    [updateProjectFromMouse, isLoading],
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove)
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove)
  }, [handleGlobalMouseMove])

  // Loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setShowMainContent(true)
            setTimeout(() => {
              setIsLoading(false)
            }, 1500)
          }, 3000)
          return 100
        }
        return prev + 1
      })
    }, 120)

    return () => clearInterval(interval)
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

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Efectos de fondo */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 100%)`,
              }}
              initial={{ scale: 0.1, rotate: 0 }}
              animate={{
                scale: showMainContent ? 5 : 1,
                rotate: showMainContent ? 180 : 0,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Anillos que se expanden */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute border border-white/10 rounded-full"
                style={{
                  width: `${(i + 1) * 150}px`,
                  height: `${(i + 1) * 150}px`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: loadingProgress > i * 15 ? 1 : 0,
                  opacity: loadingProgress > i * 15 ? 0.3 : 0,
                }}
                transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
              />
            ))}

            {/* Grid arquitectónico */}
            <motion.div
              className="absolute inset-0 opacity-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: loadingProgress > 20 ? 0.1 : 0 }}
              transition={{ duration: 2 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`grid-v-${i}`}
                  className="absolute top-0 bottom-0 w-px bg-white/20"
                  style={{ left: `${(i + 1) * 8.33}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: loadingProgress > 30 ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`grid-h-${i}`}
                  className="absolute left-0 right-0 h-px bg-white/10"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: loadingProgress > 30 ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              ))}
            </motion.div>

            {/* Partículas flotantes */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: loadingProgress > 40 ? [0, 1.5, 1] : 0,
                  opacity: loadingProgress > 40 ? [0, 1, 0.6] : 0,
                  y: loadingProgress > 40 ? [0, -30, 0] : 0,
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}

            <div className="text-center relative z-10">
              {/* Logo principal */}
              <motion.div
                className="relative mb-16"
                initial={{ scale: 0.1, opacity: 0, rotateY: 180 }}
                animate={{
                  scale: showMainContent ? 4 : 1,
                  opacity: showMainContent ? 0 : 1,
                  rotateY: showMainContent ? 360 : 0,
                }}
                transition={{
                  duration: showMainContent ? 1.5 : 3,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              >
                {/* Halo de luz */}
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: loadingProgress > 20 ? [0, 3, 1.5] : 0,
                    opacity: loadingProgress > 20 ? [0, 0.8, 0.3] : 0,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />

                {/* Logo LT */}
                <motion.h1
                  className="text-8xl font-light tracking-[0.3em] text-white relative z-10"
                  style={{
                    textShadow: `0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.3)`,
                  }}
                  initial={{
                    opacity: 0,
                    filter: "blur(50px)",
                    scale: 0.3,
                    letterSpacing: "0.1em",
                  }}
                  animate={{
                    opacity: showMainContent ? 0 : 1,
                    filter: showMainContent ? "blur(100px)" : "blur(0px)",
                    scale: showMainContent ? 15 : 1,
                    letterSpacing: showMainContent ? "3em" : "0.3em",
                    rotateZ: showMainContent ? 360 : 0,
                  }}
                  transition={{
                    duration: showMainContent ? 1.5 : 3,
                    delay: showMainContent ? 0 : 1,
                    ease: "easeOut",
                  }}
                >
                  LT
                </motion.h1>

                {/* Studio Design con efecto typewriter */}
                <motion.div
                  className="flex items-center justify-center space-x-6 mt-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: loadingProgress > 40 ? 1 : 0,
                    scale: loadingProgress > 40 ? 1 : 0.8,
                  }}
                  transition={{ duration: 2, delay: 2 }}
                >
                  <motion.div
                    className="h-px bg-white/50"
                    initial={{ width: 0 }}
                    animate={{ width: loadingProgress > 40 ? 100 : 0 }}
                    transition={{ duration: 2, delay: 2.5 }}
                  />

                  <motion.h2
                    className="text-xl font-light tracking-[0.4em] text-white/90"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: showMainContent ? 0 : loadingProgress > 40 ? 1 : 0,
                    }}
                    transition={{
                      duration: showMainContent ? 1 : 2,
                      delay: showMainContent ? 0 : 2.5,
                    }}
                  >
                    <div className="flex">
                      {"STUDIO DESIGN".split("").map((char, index) => (
                        <motion.span
                          key={index}
                          className="inline-block"
                          initial={{ opacity: 0, y: 30, rotateX: 90 }}
                          animate={{
                            opacity: loadingProgress > 50 ? 1 : 0,
                            y: loadingProgress > 50 ? 0 : 30,
                            rotateX: loadingProgress > 50 ? 0 : 90,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: loadingProgress > 50 ? 3 + index * 0.1 : 0,
                            ease: "easeOut",
                          }}
                          style={{
                            marginRight: char === " " ? "0.5em" : "0",
                            textShadow: "0 0 30px rgba(255,255,255,0.4)",
                            transformOrigin: "center bottom",
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </div>
                  </motion.h2>

                  <motion.div
                    className="h-px bg-white/50"
                    initial={{ width: 0 }}
                    animate={{ width: loadingProgress > 40 ? 100 : 0 }}
                    transition={{ duration: 2, delay: 2.5 }}
                  />
                </motion.div>
              </motion.div>

              {/* Círculo arquitectónico */}
              <motion.div
                className="w-48 h-48 mx-auto mb-12 rounded-full relative"
                initial={{ scale: 0, opacity: 0, rotateX: 90 }}
                animate={{
                  scale: loadingProgress > 60 ? 1 : 0,
                  opacity: loadingProgress > 60 ? 1 : 0,
                  rotateX: loadingProgress > 60 ? 0 : 90,
                }}
                transition={{ duration: 2, delay: 4 }}
              >
                {[0, 20, 40, 60].map((inset, index) => (
                  <motion.div
                    key={index}
                    className="absolute rounded-full border border-white/20"
                    style={{ inset: `${inset}px` }}
                    initial={{ scale: 0.5, opacity: 0, rotateZ: 180 }}
                    animate={{
                      scale: loadingProgress > 70 + index * 5 ? 1 : 0.5,
                      opacity: loadingProgress > 70 + index * 5 ? 1 : 0,
                      rotateZ: loadingProgress > 70 + index * 5 ? 0 : 180,
                    }}
                    transition={{ duration: 1.5, delay: 4.5 + index * 0.3 }}
                  />
                ))}

                <motion.div
                  className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: loadingProgress > 85 ? 1 : 0 }}
                  transition={{ duration: 1, delay: 5.5 }}
                />
                <motion.div
                  className="absolute left-0 right-0 top-1/2 h-px bg-white/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: loadingProgress > 85 ? 1 : 0 }}
                  transition={{ duration: 1, delay: 5.5 }}
                />
              </motion.div>

              {/* Barra de progreso */}
              <motion.div
                className="relative w-96 mx-auto mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: loadingProgress > 60 ? 1 : 0,
                  y: loadingProgress > 60 ? 0 : 50,
                }}
                transition={{ duration: 1.5, delay: 4 }}
              >
                <div className="h-px bg-white/10 mx-auto relative overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-white via-white to-white/50"
                    style={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />

                  <motion.div
                    className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    animate={{
                      x: loadingProgress > 0 ? [`-96px`, `${loadingProgress * 3.84}px`] : "-96px",
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              {/* Porcentaje */}
              <motion.div
                className="text-xl tracking-widest text-white/80 font-light mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: loadingProgress > 60 ? 1 : 0 }}
                transition={{ delay: 4 }}
              >
                <motion.span
                  key={Math.floor(loadingProgress)}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.floor(loadingProgress) < 10 ? `0${Math.floor(loadingProgress)}` : Math.floor(loadingProgress)}
                </motion.span>
                <span className="text-white/40">%</span>
              </motion.div>

              {/* Texto de estado con typewriter */}
              <motion.div
                className="text-sm uppercase tracking-[0.3em] text-white/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: loadingProgress > 70 ? 1 : 0,
                  y: loadingProgress > 70 ? 0 : 20,
                }}
                transition={{ delay: 5 }}
              >
                <div className="flex justify-center">
                  {(loadingProgress < 100 ? "Materializando experiencia..." : "¡Entrando al estudio!")
                    .split("")
                    .map((char, index) => (
                      <motion.span
                        key={index}
                        className="inline-block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: loadingProgress > 70 ? 1 : 0 }}
                        transition={{
                          duration: 0.1,
                          delay: loadingProgress > 70 ? 5.5 + index * 0.03 : 0,
                        }}
                        style={{ marginRight: char === " " ? "0.3em" : "0" }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="min-h-screen bg-black text-white overflow-hidden relative">
              {/* Grid arquitectónico de fondo */}
              <motion.div
                className="fixed inset-0 z-5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isMoving ? 0.3 : 0.1 }}
                transition={{ duration: 0.3 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-white/10"
                    style={{ left: `${(i + 1) * 5}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isMoving ? 1 : 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                  />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-white/10"
                    style={{ top: `${(i + 1) * 8}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isMoving ? 1 : 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                  />
                ))}
              </motion.div>

              {/* Líneas de construcción que siguen el mouse */}
              <motion.div
                className="fixed inset-0 z-6 pointer-events-none"
                animate={{ opacity: isMoving ? 0.7 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-px bg-white/50"
                  style={{
                    top: mousePosition.y,
                    boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isMoving ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute top-0 bottom-0 w-px bg-white/50"
                  style={{
                    left: mousePosition.x,
                    boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isMoving ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute text-xs font-mono text-white/60 tracking-wider"
                  style={{
                    left: mousePosition.x + 15,
                    top: mousePosition.y - 25,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isMoving ? 1 : 0, scale: isMoving ? 1 : 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {mousePosition.x.toFixed(0)}, {mousePosition.y.toFixed(0)}
                </motion.div>
              </motion.div>

              {/* Background Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject}
                  className="fixed inset-0 z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${projects[currentProject].image})`,
                      filter: "brightness(0.8)",
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${projects[currentProject].color} opacity-15`} />
                  <div className="absolute inset-0 bg-black/5" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <nav className="fixed top-0 left-0 right-0 z-30 p-8">
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <div className="text-xl font-light tracking-wider">LT</div>
                  <div className="flex space-x-8 text-sm tracking-wide">
                    <span className="hover:text-zinc-400 transition-colors">All</span>
                    <span className="hover:text-zinc-400 transition-colors">About</span>
                  </div>
                </motion.div>
              </nav>

              {/* Main Circle Interface */}
              <div className="min-h-screen flex items-center justify-center relative z-10">
                <div className="relative">
                  <motion.div
                    ref={circleRef}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Link href={`/project/${projects[currentProject].id}`} className="block">
                      <motion.div
                        className="w-[400px] h-[400px] relative overflow-hidden rounded-full"
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.12) 100%)`,
                          backdropFilter: "blur(40px)",
                          border: "3px solid rgba(255,255,255,0.4)",
                          boxShadow: `0 0 80px rgba(255,255,255,0.3), inset 0 0 80px rgba(255,255,255,0.12), 0 0 160px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.2)`,
                        }}
                        animate={{
                          scale: isHovering ? 1.05 : 1,
                          rotate: isUserInteracting ? mouseAngle * 0.1 : autoRotationAngle * 0.1,
                        }}
                        transition={{
                          scale: { duration: 0.6, ease: "easeOut" },
                          rotate: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 },
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Project Image */}
                        <div className="absolute inset-2 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                            style={{ backgroundImage: `url(${projects[currentProject].image})` }}
                          />
                          <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Project Text */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                          <div className="text-center">
                            <motion.h2
                              className="text-2xl font-light tracking-[0.1em] text-white mb-2"
                              key={`name-${currentProject}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
                            >
                              {projects[currentProject].name}
                            </motion.h2>

                            <motion.div
                              className="text-sm tracking-[0.2em] text-white/80 uppercase font-light"
                              key={`category-${currentProject}`}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
                            >
                              {projects[currentProject].category}
                            </motion.div>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-white/0 hover:bg-white/12 transition-colors duration-500 rounded-full backdrop-blur-sm" />
                      </motion.div>
                    </Link>
                  </motion.div>

                  {/* Progress Circle */}
                  <AnimatePresence>
                    {isHovering && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none z-20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          className="absolute w-[460px] h-[460px] top-[-30px] left-[-30px]"
                          style={{ transform: "rotate(-90deg)" }}
                        >
                          <circle
                            cx="230"
                            cy="230"
                            r="220"
                            fill="none"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="3"
                          />

                          <motion.circle
                            cx="230"
                            cy="230"
                            r="220"
                            fill="none"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 220}`}
                            animate={{
                              strokeDashoffset: `${2 * Math.PI * 220 - (progressPercentage / 100) * 2 * Math.PI * 220}`,
                            }}
                            transition={{ duration: 0.1, ease: "easeOut" }}
                            style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.7))" }}
                          />

                          {projects.map((_, index) => {
                            const sectionSize = 360 / projects.length
                            const sectionStartAngle = sectionSize * index
                            const angleRad = (sectionStartAngle * Math.PI) / 180
                            const innerRadius = 210
                            const outerRadius = 230

                            const x1 = 230 + innerRadius * Math.cos(angleRad)
                            const y1 = 230 + innerRadius * Math.sin(angleRad)
                            const x2 = 230 + outerRadius * Math.cos(angleRad)
                            const y2 = 230 + outerRadius * Math.sin(angleRad)

                            return (
                              <line
                                key={`divider-${index}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="2"
                              />
                            )
                          })}

                          {projects.map((_, index) => {
                            const sectionSize = 360 / projects.length
                            const sectionStartAngle = sectionSize * index
                            const currentSection = Math.floor(progressPercentage / (100 / projects.length))
                            const isActive = currentSection === index

                            const radius = 220
                            const angleRad = (sectionStartAngle * Math.PI) / 180
                            const x = 230 + radius * Math.cos(angleRad)
                            const y = 230 + radius * Math.sin(angleRad)

                            return (
                              <motion.div
                                key={`marker-${index}`}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                  left: `${x}px`,
                                  top: `${y}px`,
                                  transform: "translate(-50%, -50%)",
                                }}
                                animate={{
                                  backgroundColor: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
                                  scale: isActive ? 1.8 : 1,
                                  boxShadow: isActive
                                    ? "0 0 25px rgba(255,255,255,1)"
                                    : "0 0 10px rgba(255,255,255,0.4)",
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            )
                          })}
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons - Siempre visibles */}
                  <>
                    {/* Previous Project Button */}
                    <motion.button
                      className="absolute left-[-80px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors group z-30"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const prevProject = currentProject === 0 ? projects.length - 1 : currentProject - 1
                        setCurrentProject(prevProject)
                        setProgressPercentage((prevProject / projects.length) * 100)
                        setIsUserInteracting(true)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white group-hover:text-white/80"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>

                    {/* Next Project Button */}
                    <motion.button
                      className="absolute right-[-80px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors group z-30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const nextProject = currentProject === projects.length - 1 ? 0 : currentProject + 1
                        setCurrentProject(nextProject)
                        setProgressPercentage((nextProject / projects.length) * 100)
                        setIsUserInteracting(true)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white group-hover:text-white/80"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  </>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REMOVIDO: Upload Button */}
      {/* <UploadButton /> */}

      {/* Custom Cursor */}
      {!isLoading && (
        <motion.div
          className="fixed pointer-events-none z-[9999]"
          style={{ left: 0, top: 0 }}
          animate={{
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
          }}
          transition={{
            type: "tween",
            duration: 0.1,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="relative w-10 h-10"
            animate={{ scale: isHovering ? 1.5 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/60"
              animate={{
                scale: isMoving ? [1, 1.2, 1] : 1,
                opacity: isMoving ? 0.8 : 0.6,
              }}
              transition={{ duration: 0.3 }}
              style={{ boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
            />

            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
              style={{
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              }}
              animate={{ scale: isHovering ? 1.5 : 1 }}
              transition={{ duration: 0.2 }}
            />

            {isHovering && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50%" cy="50%" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 15}`}
                    style={{
                      strokeDashoffset: `${2 * Math.PI * 15 - (progressPercentage / 100) * 2 * Math.PI * 15}`,
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))",
                    }}
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
