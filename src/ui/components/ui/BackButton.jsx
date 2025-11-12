import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(-1)}
      className="cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      whileHover={{ x: -3, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300 }}
      title="Retour"
    >
      <ArrowLeft size={20} className="text-gray-600 hover:text-blue-600 transition-colors duration-200" />
    </motion.div>
  )
}
