import { motion } from 'framer-motion'
import './Templates.css'

const REPO = 'https://github.com/effectstream/effectstream/tree/v-next-bun-start'

const templates = [
  {
    name: 'EVM-Cardano Dev Environment',
    desc: 'Full local multi-chain dev setup with Hardhat, YACI DevKit, and Dolos. Spin up EVM + Cardano in minutes.',
    chains: ['EVM', 'Cardano'],
    tools: ['DEMO'],
    image: '/home/evm-cardano-2.png',
    accent: 'var(--cyan)',
    code: `${REPO}/templates/evm-cardano`,
  },
  {
    name: 'Safe Solver',
    desc: 'Fast interactive multichain game. Deterministic random per block, L2 interaction for game execution on Arbitrum + Midnight.',
    chains: ['Arbitrum', 'Midnight'],
    tools: ['Game'],
    image: '/home/ss.png',
    accent: '#f59e0b',
    code: 'https://github.com/effectstream/safe-solver',
    liveUrl: 'https://safesolver.midnight.fun/',
  },
  {
    name: 'Kachina Kolosseum',
    desc: 'Multiplayer Midnight ZK game with browser proofs. Commit-reveal scheme written in Compact language.',
    chains: ['Midnight'],
    tools: ['Game'],
    image: '/home/kk.png',
    accent: 'var(--purple)',
    code: 'https://github.com/PaimaStudios/pvp-arena',
    liveUrl: 'https://kachina.midnight.fun/',
  },
  {
    name: 'Block Kart Legends',
    desc: 'Complex on-chain TypeScript simulation. Deterministic L2 based on EVM + Midnight blocks executes race simulations.',
    chains: ['Arbitrum', 'Midnight'],
    tools: ['Game'],
    image: '/home/bkl.png',
    accent: 'var(--cyan)',
    code: 'https://github.com/effectstream/block-kart-legends',
    liveUrl: 'https://blockkart.paimastudios.com/',
  },
  {
    name: 'Dust-2-Dust',
    desc: 'Roguelike deck builder fully written in Compact. Proves ZK languages can encode complex game behaviors. WASM browser proofs.',
    chains: ['Midnight'],
    tools: ['Game'],
    image: '/home/d2d.png',
    accent: 'var(--magenta)',
    code: 'https://github.com/PaimaStudios/midnight-game-2/',
    liveUrl: 'https://dust2dust.midnight.fun/',
  },
  {
    name: 'Quest for Tokens',
    desc: 'AI NPC judges player answers and awards tokens. Deterministic LLM via Shinkai for on-chain consensus.',
    chains: ['EVM', 'AI'],
    tools: ['Game'],
    image: '/home/taiko1.png',
    accent: 'var(--purple)',
    code: `${REPO}/templates/shinkai-v2`,
    liveUrl: 'https://taiko-demo.paimastudios.com/',
  },
  {
    name: 'Go Fish',
    desc: 'ZK implementation of Mental Poker. Trustless card games on a ZK contract, applicable to any card-like game.',
    chains: ['Midnight'],
    tools: ['Game'],
    image: '/home/gofish.png',
    accent: '#f59e0b',
    code: 'https://github.com/effectstream/go-fish',
  },
  {
    name: 'Private Delegation Voting',
    desc: 'Governance votes weighted by Cardano stake delegation, with ballots kept private via Midnight ZK proofs.',
    chains: ['Cardano', 'Midnight'],
    tools: ['ZK'],
    image: '/home/zk-cardano.png',
    accent: 'var(--cyan)',
    code: `${REPO}/templates/zk-cardano`,
  },
  {
    name: 'NFT Launchpad',
    desc: 'Cross-chain NFT pre-order platform. Cardano and EVM payments, campaign management, and proof of ownership.',
    chains: ['EVM', 'Cardano'],
    tools: ['Hololocker'],
    image: '/home/preorder-2.png',
    accent: 'var(--magenta)',
    code: `${REPO}/templates/preorder`,
  },
  {
    name: 'Stake Pool Delegation',
    desc: 'React to Cardano delegation changes in real-time. PoolDelegation primitive via Dolos and UTxORPC Watch.',
    chains: ['Cardano'],
    tools: ['Stake-pools'],
    image: '/home/delegate-pool1.png',
    accent: 'var(--purple)',
    code: `${REPO}/templates/cardano-delegation`,
  },
  {
    name: 'Celestia DA Demo',
    desc: 'High-throughput data availability with Celestia. Batcher posts batches to DA layer while settling on EVM.',
    chains: ['EVM', 'Celestia'],
    tools: ['ZSwap'],
    image: '/home/da-main.png',
    accent: 'var(--cyan)',
    code: `${REPO}/bun-zswap-da`,
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
            <motion.a
              key={t.name}
              className="template-card glass"
              href={t.code}
              target="_blank"
              rel="noopener noreferrer"
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

                {t.liveUrl && (
                  <div className="template-actions">
                    <span
                      className="template-live"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(t.liveUrl, '_blank')
                      }}
                    >
                      Try live
                    </span>
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
