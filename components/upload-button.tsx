"use client"

import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import Link from "next/link"

export default function UploadButton() {
  return (
    <Link href="/upload">
      <motion.div
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <Upload size={24} className="text-white group-hover:text-white/80" />
      </motion.div>
    </Link>
  )
}
