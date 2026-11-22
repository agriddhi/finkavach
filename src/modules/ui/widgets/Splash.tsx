import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export function Splash({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={() => onDone()}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#14203A' }}
    >
      {/* single hairline, like a printed cover rule */}
      <span aria-hidden="true" className="absolute top-0 left-1/2 h-full w-px" style={{ background: 'rgba(255,201,60,0.25)' }} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 140, damping: 16 }}>
        <div className="h-16 w-16 rounded-[8px] flex items-center justify-center" style={{ background: '#FFC93C', border: '1px solid #E8B01F' }}>
          <Shield className="h-8 w-8" style={{ color: '#14203A' }} />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="mt-5 font-display font-extrabold text-3xl tracking-tight" style={{ color: '#FFFDF8' }}>FinKavach</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <div className="mt-2 font-hand text-lg" style={{ color: '#FFC93C' }}>Bachao bhi, Badhao bhi</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="mt-8 font-mono text-[10px] tracking-[0.2em]" style={{ color: 'rgba(255,253,248,0.55)' }}>V1 · FINKAVACH AI</div>
      </motion.div>
    </motion.div>
  )
}
