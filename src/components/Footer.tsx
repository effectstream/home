import { motion } from 'framer-motion'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer-cta glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to build?</h2>
          <p>Clone the repo, read the docs, and launch your first multi-chain app today.</p>
          <div className="footer-actions">
            <motion.a
              href="#quickstart"
              className="btn btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              Get Started
            </motion.a>
            <motion.a
              href="https://effectstream.github.io/docs/"
              target="_blank"
              rel="noopener"
              className="btn btn-ghost"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
              </svg>
              Read the Docs
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Star on GitHub
            </motion.a>
          </div>
        </motion.div>

        <div className="footer-bottom">
          <div className="footer-brand">
            <span className="footer-logo">EffectStream</span>
            <span className="footer-copy">Collect, sync, and execute across every chain</span>
          </div>
          <div className="footer-links">
            <a href="https://github.com/PaimaStudios/paima-engine" target="_blank" rel="noopener">GitHub</a>
            <a href="https://effectstream.github.io/docs/" target="_blank" rel="noopener">Docs</a>
            <a href="https://github.com/PaimaStudios/paima-engine/issues" target="_blank" rel="noopener">Issues</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
