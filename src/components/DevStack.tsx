import { motion } from 'framer-motion'
import './DevStack.css'

interface Process {
  name: string
  status: 'running' | 'up' | 'done' | 'down' | 'idle'
  pid?: number
  ports?: string
  started?: string
  link?: string
  starred?: boolean
}

const processes: Process[] = [
  { name: 'hardhat', status: 'up', pid: 108, ports: '8545, 8546' },
  { name: 'hardhat-wait', status: 'done' },
  { name: 'build-evm-contracts', status: 'done' },
  { name: 'deploy-evm-contracts', status: 'done' },
  { name: 'bitcoin-core', status: 'down', ports: '18334, 18443' },
  { name: 'midnight-node', status: 'running', pid: 70784, ports: '9944, 8088, 6300', started: '5m ago' },
  { name: 'midnight-indexer', status: 'running', pid: 70763, started: '5m ago' },
  { name: 'midnight-proof-server', status: 'running', pid: 70765, started: '5m ago' },
  { name: 'midnight-node-wait', status: 'done', pid: 70762 },
  { name: 'avail-client', status: 'down', ports: '9955, 30334' },
  { name: 'cardano-node', status: 'down', ports: '8090, 10000, 3001' },
  { name: 'dolos', status: 'down', ports: '3000, 50051' },
  { name: 'loki', status: 'up', pid: 99900, ports: '3100', starred: true },
  { name: 'collector', status: 'up', pid: 108, ports: '4318', starred: true },
  { name: 'pglite', status: 'running', pid: 70721, ports: '5432', started: '5m ago' },
  { name: 'pglite-wait', status: 'done', pid: 70761 },
  { name: 'apply-migrations', status: 'done', pid: 70788 },
  { name: 'batcher', status: 'up', pid: 4604, ports: '3334' },
  { name: 'build-explorer', status: 'down', ports: '10590' },
  { name: 'serve-explorer', status: 'down', ports: '10590', link: 'http://localhost:10590' },
  { name: 'sync', status: 'running', pid: 72883, ports: '9999', started: '4m ago' },
]

const statusColor: Record<string, string> = {
  running: 'var(--cyan)',
  up: 'var(--cyan)',
  done: 'var(--text-tertiary)',
  down: 'rgba(255,255,255,0.15)',
  idle: 'rgba(255,255,255,0.08)',
}

const statusDot: Record<string, string> = {
  running: '#06d6a0',
  up: '#06d6a0',
  done: 'var(--text-tertiary)',
  down: '#555',
  idle: '#333',
}

export default function DevStack() {
  return (
    <section className="section" id="devstack">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Local Development
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Full stack, running locally
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <span className="brand">EffectStream</span> spins up real blockchain nodes, databases, indexers, and dev tools on your machine. No testnet keys, no cloud accounts — everything runs locally.
        </motion.p>

        <motion.div
          className="devstack-terminal glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="devstack-bar">
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <span className="devstack-bar-title">effectstream status</span>
          </div>

          <div className="devstack-table">
            <div className="devstack-header">
              <span className="col-name">NAME</span>
              <span className="col-status">STATUS</span>
              <span className="col-pid">PID</span>
              <span className="col-ports">PORTS</span>
              <span className="col-started">STARTED</span>
            </div>
            <div className="devstack-divider" />
            {processes.map((p, i) => (
              <motion.div
                key={p.name}
                className={`devstack-row ${p.status === 'down' || p.status === 'idle' ? 'devstack-row-dim' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.02, duration: 0.3 }}
              >
                <span className="col-name">
                  {p.starred && <span className="devstack-star">*</span>}
                  {p.name}
                </span>
                <span className="col-status" style={{ color: statusColor[p.status] }}>
                  <span className="status-dot" style={{ background: statusDot[p.status] }} />
                  {p.status === 'idle' ? '—' : p.status}
                </span>
                <span className="col-pid">{p.pid || '—'}</span>
                <span className="col-ports">{p.ports || '—'}</span>
                <span className="col-started">
                  {p.link ? (
                    <a href={p.link} className="devstack-link">{p.started || '—'}</a>
                  ) : (
                    p.started || '—'
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
