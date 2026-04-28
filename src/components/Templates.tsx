import { motion } from 'framer-motion'
import './Templates.css'

const templates = [
  {
    name: 'EVM + Midnight',
    desc: 'Cross-chain starter with EVM contracts and Midnight privacy.',
    chains: ['EVM', 'Midnight'],
    tools: ['Batcher', 'Sync', 'Explorer'],
    image: 'https://placehold.co/600x340/1a1a2e/06d6a0?text=EVM+%2B+Midnight',
    accent: 'var(--cyan)',
  },
  {
    name: 'Minimal',
    desc: 'Bare-bones template - just an EVM chain and a state machine.',
    chains: ['EVM'],
    tools: ['Batcher', 'Sync'],
    image: 'https://placehold.co/600x340/1a1a2e/8b5cf6?text=Minimal',
    accent: 'var(--purple)',
  },
  {
    name: 'Chess',
    desc: 'Fully on-chain chess game with move validation and matchmaking.',
    chains: ['EVM'],
    tools: ['Batcher', 'State Machine', 'Frontend'],
    image: 'https://placehold.co/600x340/1a1a2e/ec4899?text=Chess',
    accent: 'var(--magenta)',
  },
  {
    name: 'Dice',
    desc: 'Simple dice game with random number generation and betting.',
    chains: ['EVM'],
    tools: ['Batcher', 'State Machine'],
    image: 'https://placehold.co/600x340/1a1a2e/f59e0b?text=Dice',
    accent: '#f59e0b',
  },
  {
    name: 'Rock Paper Scissors',
    desc: 'Commit-reveal RPS with cross-chain settlement.',
    chains: ['EVM', 'Midnight'],
    tools: ['Batcher', 'Sync', 'Frontend'],
    image: 'https://placehold.co/600x340/1a1a2e/06d6a0?text=Rock+Paper+Scissors',
    accent: 'var(--cyan)',
  },
  {
    name: 'World Map 2D',
    desc: 'Shared world map with tile-based state and multi-player sync.',
    chains: ['EVM'],
    tools: ['Batcher', 'Sync', 'State Machine', 'Frontend'],
    image: 'https://placehold.co/600x340/1a1a2e/8b5cf6?text=World+Map+2D',
    accent: 'var(--purple)',
  },
]

export default function Templates() {
  return (
    <section className="section" id="templates">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Templates
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Start from a working example
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Pick a template, run <code>bun run dev</code>, and start building. Each one is a complete, runnable project.
        </motion.p>

        <div className="templates-grid">
          {templates.map((t, i) => (
            <motion.div
              key={t.name}
              className="template-card glass"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="template-preview">
                <img src={t.image} alt={`${t.name} preview`} loading="lazy" />
              </div>

              <div className="template-body">
                <h3>{t.name}</h3>
                <p>{t.desc}</p>

                <div className="template-pills">
                  {t.chains.map(c => (
                    <span key={c} className="pill pill-chain">{c}</span>
                  ))}
                  {t.tools.map(tool => (
                    <span key={tool} className="pill pill-tool">{tool}</span>
                  ))}
                </div>

                <motion.a
                  href="#quickstart"
                  className="template-cta"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  Get started now
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
