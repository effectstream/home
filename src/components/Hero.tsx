import { motion } from 'framer-motion'
import { chainData } from './ChainLogos'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content container">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="badge-dot" />
          Open Source
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Build multi-chain apps.
          <br />
          <span className="hero-gradient">Launch in minutes.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="brand">EffectStream</span> is an open-source rollup framework that connects
          EVM, Midnight, Bitcoin, Cardano, and more into a single
          deterministic state machine.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <motion.a
            href="#quickstart"
            className="btn btn-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
          <motion.a
            href="https://github.com/PaimaStudios/paima-engine"
            target="_blank"
            rel="noopener"
            className="btn btn-ghost"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </motion.a>
        </motion.div>

        {/* Floating chain badges */}
        <motion.div
          className="hero-chains"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {chainData.map((chain, i) => (
            <motion.span
              key={chain.name}
              className={`chain-pill ${chain.name === 'EVM' ? 'chain-pill-evm' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.1, y: -3 }}
            >
              <span className="chain-logos">
                {chain.logos.map((logo, j) => (
                  <span key={j} className="chain-logo-icon">{logo}</span>
                ))}
                {chain.more && <span className="chain-more">+{chain.more}</span>}
              </span>
              {chain.name}
              {chain.name === 'EVM' && (
                <span className="evm-tooltip">
                  <span className="evm-tooltip-item">Ethereum</span>
                  <span className="evm-tooltip-item">Polygon</span>
                  <span className="evm-tooltip-item">Arbitrum</span>
                  <span className="evm-tooltip-item">Optimism</span>
                  <span className="evm-tooltip-item">Base</span>
                  <span className="evm-tooltip-item">BNB Chain</span>
                  <span className="evm-tooltip-item">Avalanche</span>
                  <span className="evm-tooltip-item">zkSync</span>
                  <span className="evm-tooltip-item">Linea</span>
                  <span className="evm-tooltip-item">Scroll</span>
                  <span className="evm-tooltip-more">+ any EVM compatible chain</span>
                </span>
              )}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
