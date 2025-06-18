"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === "lucianot1" && password === "Lucianoavolites1205+") {
      // Guardar sesión
      localStorage.setItem("lt_admin_auth", "authenticated")
      localStorage.setItem("lt_admin_user", username)
      localStorage.setItem("lt_admin_timestamp", Date.now().toString())

      // Redireccionar al admin
      router.push("/admin")
    } else {
      setError("Credenciales incorrectas")
    }

    setIsLoading(false)
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

      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>

        <motion.div
          className="relative z-10 w-full max-w-md p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-6">
              <Lock size={24} className="text-white/80" />
            </div>
            <h1 className="text-3xl font-thin tracking-wider mb-2">LT ADMIN</h1>
            <p className="text-white/60 text-sm tracking-wide">SECURE ACCESS REQUIRED</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-light tracking-wide mb-3 text-white/80">USERNAME</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-light tracking-wide mb-3 text-white/80">PASSWORD</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-light tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>AUTHENTICATING...</span>
                  </div>
                ) : (
                  "ACCESS ADMIN PANEL"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8 text-white/40 text-xs tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            LUCIANO TORRES • ARCHITECTURAL STUDIO
          </motion.div>
        </motion.div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>
    </>
  )
}
