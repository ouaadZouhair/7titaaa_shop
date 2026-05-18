import { motion } from 'motion/react'

/**
 * variant: 'primary' | 'dark' | 'outline' | 'gradient'
 */
export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
}) {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-semibold text-sm tracking-wider uppercase px-7 py-3.5 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 select-none'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark shadow-[0_0_0_0_rgba(22,163,74,0.4)]',
    dark: 'bg-street-black text-white hover:bg-street-dark border border-white/10',
    outline:
      'bg-transparent text-white border border-white/40 hover:border-white hover:bg-white/5',
    gradient:
      'text-white border-0',
  }

  const gradientStyle =
    variant === 'gradient'
      ? { background: 'linear-gradient(135deg,#16a34a,#f97316,#ef4444)' }
      : {}

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.04, boxShadow: disabled ? undefined : '0 0 24px rgba(22,163,74,0.35)' }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={gradientStyle}
    >
      {children}
    </motion.button>
  )
}
