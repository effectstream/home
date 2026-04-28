import { motion } from 'framer-motion'
import './BentoGrid.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

const springHover = {
  whileHover: { scale: 1.02, y: -4 },
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
}

export default function BentoGrid() {
  return (
    <section className="section" id="features">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why <span className="brand">EffectStream</span>
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Everything you need for multi-chain
        </motion.h2>

        <div className="bento">
          {/* Row 1: wide + narrow */}
          <motion.div
            className="bento-card bento-wide glass"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>Crash-Safe Batcher</h3>
            <p>Aggregates user inputs across chains and submits them in batches. Storage is the single source of truth - zero data loss on restart. Flexible strategies: time, size, value, hybrid, or custom.</p>
          </motion.div>

          <motion.div
            className="bento-card bento-narrow glass bento-code-card"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <pre className="bento-code">
              <code>
                <span className="code-kw">bun run</span> dev{'\n'}
                <span className="code-dim">{'>'} hardhat   ✓</span>{'\n'}
                <span className="code-dim">{'>'} batcher   ✓</span>{'\n'}
                <span className="code-dim">{'>'} sync      ✓</span>{'\n'}
                <span className="code-dim">{'>'} explorer  ✓</span>
              </code>
            </pre>
          </motion.div>

          {/* Row 2: full-width adapters explainer */}
          <motion.div
            className="bento-card bento-full glass"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
                <circle cx="8" cy="6" r="1.5" fill="var(--purple)"/>
                <circle cx="16" cy="12" r="1.5" fill="var(--purple)"/>
                <circle cx="10" cy="18" r="1.5" fill="var(--purple)"/>
              </svg>
            </div>
            <h3>Sync Protocols, Primitives &amp; Batcher Adapters</h3>
            <p><span className="brand">EffectStream</span> has three layers. <strong>Sync Protocols</strong> connect to a chain. <strong>Primitives</strong> are the specific data feeds within each protocol (ERC-20 transfers, UTXO outputs, etc.). <strong>Batcher Adapters</strong> write transactions back. Mix and match - read Bitcoin UTXOs and submit to Midnight.</p>
            <div className="bento-three-col">
              <div className="bento-col">
                <span className="bento-col-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
                  Sync Protocols
                </span>
                <p className="bento-col-desc">One per chain - connects and reads blocks</p>
                <div className="bento-pill-group">
                  {['EVM', 'Bitcoin', 'Cardano', 'NEAR', 'Midnight', 'Avail', 'Celestia', 'NTP'].map(p => (
                    <span key={p} className="pill pill-neutral">{p}</span>
                  ))}
                  <span className="pill pill-more">+ more</span>
                </div>
              </div>
              <div className="bento-col">
                <span className="bento-col-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  Primitives
                </span>
                <p className="bento-col-desc">Specific data feeds per protocol</p>
                <div className="bento-pill-group">
                  <span className="pill pill-chain-label">EVM</span>
                  {['ERC-20', 'ERC-721', 'ERC-1155', 'Generic Events', 'Block Data'].map(f => (
                    <span key={f} className="pill pill-chain">{f}</span>
                  ))}
                  <span className="pill pill-chain-label">Bitcoin</span>
                  {['UTXO Inputs', 'UTXO Outputs'].map(f => (
                    <span key={f} className="pill pill-chain">{f}</span>
                  ))}
                  <span className="pill pill-chain-label">Cardano</span>
                  {['UTXORpc', 'Asset Moves', 'Asset Mints'].map(f => (
                    <span key={f} className="pill pill-chain">{f}</span>
                  ))}
                  <span className="pill pill-chain-label">NEAR</span>
                  {['NEP-297', 'Token Filter'].map(f => (
                    <span key={f} className="pill pill-chain">{f}</span>
                  ))}
                  <span className="pill pill-chain-label">Others</span>
                  {['Midnight State', 'Avail DA', 'Celestia Blobs', 'NTP Clock'].map(f => (
                    <span key={f} className="pill pill-chain">{f}</span>
                  ))}
                  <span className="pill pill-more">+ more</span>
                </div>
              </div>
              <div className="bento-col">
                <span className="bento-col-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  Batcher Adapters
                </span>
                <p className="bento-col-desc">Submit batched transactions back to chains</p>
                <div className="bento-pill-group">
                  <span className="pill pill-tool-label">EVM</span>
                  {['Contract Calls', 'EffectStream L2'].map(a => (
                    <span key={a} className="pill pill-tool">{a}</span>
                  ))}
                  <span className="pill pill-tool-label">Midnight</span>
                  {['Circuits', 'Balancing'].map(a => (
                    <span key={a} className="pill pill-tool">{a}</span>
                  ))}
                  <span className="pill pill-tool-label">NEAR</span>
                  {['Contracts', 'Intents'].map(a => (
                    <span key={a} className="pill pill-tool">{a}</span>
                  ))}
                  <span className="pill pill-tool-label">Bitcoin</span>
                  {['UTXO TX'].map(a => (
                    <span key={a} className="pill pill-tool">{a}</span>
                  ))}
                  <span className="pill pill-more">+ more</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 3: three equal */}
          <motion.div
            className="bento-card bento-third glass"
            custom={4}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--magenta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8"/>
                <path d="M12 17v4"/>
                <path d="M7 8l3 3-3 3"/>
                <path d="M13 14h4"/>
              </svg>
            </div>
            <h3>One Command Launch</h3>
            <p>The orchestrator spins up local chains, database, batcher, and explorer with <code>bun run dev</code>.</p>
          </motion.div>

          <motion.div
            className="bento-card bento-third glass"
            custom={5}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Deterministic</h3>
            <p>Every node produces identical results. Your state machine, callbacks, and tasks execute on synced data.</p>
          </motion.div>

          <motion.div
            className="bento-card bento-third glass"
            custom={6}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h3>TypeScript Native</h3>
            <p>Built on Bun with end-to-end TypeScript. Type-safe queries, schemas, and contracts.</p>
          </motion.div>

          {/* Row 4: wide + narrow */}
          <motion.div
            className="bento-card bento-wide glass"
            custom={7}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
            </div>
            <h3>REST API with OpenAPI</h3>
            <p>The batcher exposes a Fastify HTTP API - submit inputs, check queue stats, force batches. Built-in rate limiting, configurable confirmation levels, and auto-generated OpenAPI docs.</p>
          </motion.div>

          <motion.div
            className="bento-card bento-narrow glass"
            custom={8}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            {...springHover}
          >
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </div>
            <h3>Open Source</h3>
            <p>Fork it, extend it, self-host it. No vendor lock-in.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
