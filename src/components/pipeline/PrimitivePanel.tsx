import { motion, AnimatePresence } from 'framer-motion'
import { CHAINS } from './data'
import Tooltip from './Tooltip'

const primTips: Record<string, string> = {
  // EVM
  'eth-erc20': 'Track ERC-20 fungible token transfers — balances, approvals, and movements.',
  'eth-erc721': 'Track ERC-721 NFT transfers — mints, burns, and ownership changes.',
  uniswap: 'Sync Uniswap swap events, liquidity changes, and pool state.',
  aave: 'Sync Aave lending/borrowing events — deposits, withdrawals, liquidations.',
  chainlink: 'Sync Chainlink oracle price feed updates and VRF randomness requests.',
  // Midnight
  circuits: 'Invoke Midnight Compact circuits for private computation and ZK proof generation.',
  zswap: 'Track ZSwap shielded token ledger events on Midnight.',
  contracts: 'Sync Midnight smart contract state transitions and deployments.',
  // Bitcoin
  utxo: 'Track unspent transaction outputs — the core accounting model of Bitcoin.',
  ordinals: 'Sync Bitcoin Ordinals — inscribed data (images, text) on individual satoshis.',
  lightning: 'Track Lightning Network payment channel opens, closes, and routed payments.',
  // Arbitrum
  'arb-erc20': 'Track ERC-20 transfers on Arbitrum — same interface, faster blocks.',
  'arb-erc721': 'Track ERC-721 NFTs on Arbitrum with sub-second confirmation.',
  gmx: 'Sync GMX perpetual trading events — positions, liquidations, fees.',
  // Polygon
  'poly-erc20': 'Track ERC-20 transfers on Polygon with low-cost, fast finality.',
  'poly-erc721': 'Track ERC-721 NFTs on Polygon.',
  quickswap: 'Sync QuickSwap DEX events — swaps, LP changes, farming rewards.',
  // Cardano
  plutus: 'Sync Plutus smart contract executions and validator scripts on Cardano.',
  'native-tokens': 'Track Cardano native token movements — no smart contract needed.',
  nfts: 'Track Cardano NFTs minted under specific policy IDs.',
  // NEAR
  nep141: 'Sync NEP-141 fungible token events — the NEAR equivalent of ERC-20.',
  'ref-finance': 'Sync Ref Finance DEX events on NEAR — swaps and liquidity.',
  aurora: 'Sync Aurora EVM events — an Ethereum-compatible environment on NEAR.',
  // Celestia
  blobs: 'Read data blobs submitted to Celestia — the raw DA payloads.',
  namespaces: 'Filter Celestia data by namespace — isolate your app\'s data stream.',
  // Avail
  'app-data': 'Read application-specific data submitted to the Avail DA layer.',
  extrinsics: 'Sync Avail extrinsics — substrate transactions and their execution results.',
  // Other EVM
  'evm-erc20': 'Track ERC-20 transfers on any EVM-compatible chain.',
  'evm-erc721': 'Track ERC-721 NFTs on any EVM-compatible chain.',
  'evm-erc1155': 'Track ERC-1155 multi-token transfers — batch mints, transfers, and burns.',
  'evm-events': 'Sync any contract event by providing its ABI signature.',
}

interface Props {
  enabledChains: Set<string>
  enabledPrimitives: Set<string>
  onToggle: (id: string) => void
}

export default function PrimitivePanel({ enabledChains, enabledPrimitives, onToggle }: Props) {
  const visibleChains = CHAINS.filter(c => enabledChains.has(c.id))

  return (
    <div className="primitive-panel">
      <Tooltip text="Primitives are specific data feeds within each Sync Protocol. ERC-20 transfers, UTXO outputs, oracle updates — each is a primitive you can toggle independently." position="bottom">
        <h4 className="panel-title panel-title-help">Primitives</h4>
      </Tooltip>
      <div className="primitive-groups">
        <AnimatePresence mode="popLayout">
          {visibleChains.map(chain => (
            <motion.div
              key={chain.id}
              className="primitive-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="primitive-group-label" style={{ color: chain.color }}>
                {chain.name}
              </span>
              <div className="primitive-pills">
                {chain.primitives.map(p => {
                  const on = enabledPrimitives.has(p.id)
                  return (
                    <Tooltip key={p.id} text={primTips[p.id] || `Sync ${p.name} data from ${chain.name}.`} position="bottom">
                      <motion.button
                        className={`prim-pill ${on ? 'prim-pill-on' : ''}`}
                        style={on ? {
                          borderColor: chain.color,
                          background: `${chain.color}15`,
                          color: chain.color,
                        } : undefined}
                        onClick={() => onToggle(p.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {p.name}
                      </motion.button>
                    </Tooltip>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleChains.length === 0 && (
          <p className="primitive-empty">Enable a chain to see its primitives</p>
        )}
      </div>
    </div>
  )
}
