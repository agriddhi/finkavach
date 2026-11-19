import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export function Splash({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => onDone()}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0F766E 55%, #F59E0B 135%)' }}
    >
      <div
        className="absolute inset-0 animate-mesh opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 20%, rgba(94,234,212,0.5), transparent 55%), radial-gradient(circle at 75% 80%, rgba(251,191,36,0.45), transparent 55%), radial-gradient(circle at 50% 60%, rgba(99,102,241,0.4), transparent 60%)',
          backgroundSize: '220% 220%',
        }}
      />
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 14 }}>
        <div className="h-20 w-20 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(251,191,36,0.6)', backdropFilter: 'blur(6px)' }}>
          <Shield className="h-10 w-10" style={{ color: '#FBBF24' }} />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="mt-5 font-display font-extrabold text-4xl text-white tracking-tight">FinKavach</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="mt-2 text-sm font-medium" style={{ color: '#FDE68A' }}>Bachao bhi, Badhao bhi</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
        <div className="mt-8">
          <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.75)' }}>v1 • FinKavach AI</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
