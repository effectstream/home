import { useState } from 'react'
import { motion } from 'framer-motion'
import './QuickStart.css'

const commands = `git clone https://github.com/PaimaStudios/paima-engine.git --branch v-next
cd paima-engine/templates/evm-midnight
../check.sh
bun install --allow-scripts && ./patch.sh
bun run build:evm && bun run build:midnight
bun run dev`

export default function QuickStart() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(commands)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="section" id="quickstart">
      <div className="container">
        <div className="qs-layout">
          <div className="qs-text">
            <motion.p
              className="section-label"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Quick Start
            </motion.p>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Running in minutes
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Clone, install, launch. The orchestrator handles everything - local chains, database, batcher, explorer. You just write your state machine.
            </motion.p>

            <motion.div
              className="qs-prereqs"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4>Prerequisites</h4>
              <div className="prereq-list">
                <a href="https://bun.sh/" target="_blank" rel="noopener" className="prereq-item prereq-link">Bun</a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="qs-terminal glass"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <span className="terminal-title">terminal</span>
              <motion.button
                className="copy-btn"
                onClick={copy}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                )}
              </motion.button>
            </div>
            <pre className="terminal-body">
              <code>
{commands.split('\n').map((line, i) => (
  <span key={i} className="terminal-line">
    <span className="terminal-prompt">$</span> {line}{'\n'}
  </span>
))}
              </code>
            </pre>
            <div className="terminal-output">
              <span className="output-success">{'>'} hardhat    ✓  port 8545</span>
              <span className="output-success">{'>'} pglite     ✓  port 5432</span>
              <span className="output-success">{'>'} batcher    ✓  port 3334</span>
              <span className="output-success">{'>'} sync       ✓  port 9999</span>
              <span className="output-success">{'>'} explorer   ✓  port 10590</span>
              <span className="output-success">{'>'} frontend   ✓  port 10599</span>
              <span className="output-ready">Ready at http://localhost:10599</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
