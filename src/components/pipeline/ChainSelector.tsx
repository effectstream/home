import { motion } from 'framer-motion'
import { CHAINS } from './data'
import type { ChainConfig } from './data'
import Tooltip from './Tooltip'

const chainTips: Record<string, string> = {
  ethereum: 'The original smart contract platform. EffectStream syncs EVM events, ERC tokens, and contract state.',
  midnight: 'Privacy-focused chain using zero-knowledge proofs. EffectStream syncs contract state and ZSwap ledger events.',
  bitcoin: 'The original blockchain. EffectStream tracks UTXO inputs/outputs, Ordinals, and Lightning transactions.',
  arbitrum: 'Ethereum L2 rollup with fast blocks. EffectStream syncs the same EVM primitives at higher throughput.',
  polygon: 'EVM-compatible sidechain with low fees. EffectStream syncs ERC tokens and DeFi protocol events.',
  cardano: 'UTXO-based chain with native tokens. EffectStream syncs via UTXORpc - asset moves, mints, and Plutus scripts.',
  near: 'Sharded chain with 1-second finality. EffectStream syncs NEP-297 events and contract execution outcomes.',
  celestia: 'Modular data availability layer. EffectStream reads namespace-scoped blobs and blob commitments.',
  avail: 'Data availability layer for rollups. EffectStream syncs application-specific data submissions.',
  'other-evm': 'Any EVM-compatible chain (Base, Fantom, zkSync, etc.). If it speaks EVM RPC, EffectStream can sync it.',
}

interface Props {
  enabledChains: Set<string>
  onToggle: (id: string) => void
}

export default function ChainSelector({ enabledChains, onToggle }: Props) {
  return (
    <div className="chain-selector">
      <Tooltip text="Sync Protocols connect to each chain and read blocks, events, and state. Toggle chains to add or remove data sources from the pipeline." position="bottom">
        <h4 className="panel-title panel-title-help">Chains</h4>
      </Tooltip>
      <div className="chain-list">
        {CHAINS.map((chain: ChainConfig) => {
          const on = enabledChains.has(chain.id)
          return (
            <Tooltip key={chain.id} text={chainTips[chain.id] || ''} position="bottom">
              <motion.button
                className={`chain-row glass ${on ? 'chain-row-on' : ''}`}
                style={on ? { borderLeftColor: chain.color } : undefined}
                onClick={() => onToggle(chain.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span
                  className="chain-dot"
                  style={{ background: on ? chain.color : 'var(--text-tertiary)' }}
                />
                <span className="chain-row-name">{chain.name}</span>
                <span className="chain-row-time">{chain.blockTimeLabel}</span>
                <span className={`chain-toggle ${on ? 'chain-toggle-on' : ''}`}>
                  <span className="chain-toggle-knob" />
                </span>
              </motion.button>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
