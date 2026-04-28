import { motion } from 'framer-motion'
import './HowItWorks.css'

const steps = [
  {
    num: '01',
    title: 'Collect',
    desc: 'The Batcher aggregates user inputs and on-chain events from multiple blockchains into ordered batches.',
    color: 'var(--cyan)',
  },
  {
    num: '02',
    title: 'Sync',
    desc: 'The Sync engine connects to every chain, keeping your database in lockstep with on-chain state across all networks.',
    color: 'var(--purple)',
  },
  {
    num: '03',
    title: 'Execute',
    desc: 'Once synced, your functions, state machines, callbacks, and scheduled tasks run deterministically on the unified data.',
    color: 'var(--magenta)',
  },
]

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Three stages, one pipeline
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <span className="brand">EffectStream</span> turns multi-chain chaos into a clean, deterministic data flow.
        </motion.p>

        <div className="steps">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="step glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <span className="step-num" style={{ color: step.color }}>{step.num}</span>
              <div className="step-connector" style={{ background: step.color }} />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
