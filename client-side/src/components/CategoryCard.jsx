import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CategoryCard({ category, className = '' }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={() => navigate(`/shop?category=${category.name}`)}
      className={`relative overflow-hidden rounded-sm cursor-pointer group ${className}`}
    >
      {/* Image */}
      <div className="w-full h-full min-h-[200px] overflow-hidden">
        <motion.img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          loading="lazy"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.p
          initial={{ y: 10, opacity: 0.7 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="font-mono text-[10px] text-primary-light tracking-widest uppercase mb-1"
        >
          {t('category.items', { count: category.count })}
        </motion.p>
        <h3 className="font-display text-2xl text-white tracking-wider uppercase">
          {category.name}
        </h3>
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: '2.5rem' }}
          transition={{ duration: 0.3 }}
          className="h-[2px] mt-2 rounded-full"
          style={{ background: 'linear-gradient(90deg,#16a34a,#f97316)' }}
        />
      </div>
    </motion.div>
  )
}
