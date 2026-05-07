import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } },
}

export default function MainLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 pt-16 pb-16 md:pb-0"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <BottomNav />
    </div>
  )
}
