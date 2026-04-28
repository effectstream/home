export interface PrimitiveConfig {
  id: string
  name: string
  chainId: string
}

export interface ChainConfig {
  id: string
  name: string
  blockTimeMs: number
  blockTimeLabel: string
  color: string
  colorRgb: [number, number, number]
  primitives: PrimitiveConfig[]
}

export const CHAINS: ChainConfig[] = [
  {
    id: 'ethereum', name: 'Ethereum', blockTimeMs: 12_000, blockTimeLabel: '~12s',
    color: '#627EEA', colorRgb: [98, 126, 234],
    primitives: [
      { id: 'eth-erc20', name: 'ERC-20', chainId: 'ethereum' },
      { id: 'eth-erc721', name: 'ERC-721', chainId: 'ethereum' },
      { id: 'uniswap', name: 'Uniswap', chainId: 'ethereum' },
      { id: 'aave', name: 'Aave', chainId: 'ethereum' },
      { id: 'chainlink', name: 'Chainlink', chainId: 'ethereum' },
    ],
  },
  {
    id: 'midnight', name: 'Midnight', blockTimeMs: 6_000, blockTimeLabel: '~6s',
    color: '#6100FF', colorRgb: [97, 0, 255],
    primitives: [
      { id: 'circuits', name: 'Circuits', chainId: 'midnight' },
      { id: 'zswap', name: 'ZSwap', chainId: 'midnight' },
      { id: 'contracts', name: 'Contracts', chainId: 'midnight' },
    ],
  },
  {
    id: 'bitcoin', name: 'Bitcoin', blockTimeMs: 600_000, blockTimeLabel: '~10min',
    color: '#F7931A', colorRgb: [247, 147, 26],
    primitives: [
      { id: 'utxo', name: 'UTXO', chainId: 'bitcoin' },
      { id: 'ordinals', name: 'Ordinals', chainId: 'bitcoin' },
      { id: 'lightning', name: 'Lightning', chainId: 'bitcoin' },
    ],
  },
  {
    id: 'arbitrum', name: 'Arbitrum', blockTimeMs: 250, blockTimeLabel: '~0.25s',
    color: '#12AAFF', colorRgb: [18, 170, 255],
    primitives: [
      { id: 'arb-erc20', name: 'ERC-20', chainId: 'arbitrum' },
      { id: 'arb-erc721', name: 'ERC-721', chainId: 'arbitrum' },
      { id: 'gmx', name: 'GMX', chainId: 'arbitrum' },
    ],
  },
  {
    id: 'polygon', name: 'Polygon', blockTimeMs: 2_000, blockTimeLabel: '~2s',
    color: '#7B3FE4', colorRgb: [123, 63, 228],
    primitives: [
      { id: 'poly-erc20', name: 'ERC-20', chainId: 'polygon' },
      { id: 'poly-erc721', name: 'ERC-721', chainId: 'polygon' },
      { id: 'quickswap', name: 'QuickSwap', chainId: 'polygon' },
    ],
  },
  {
    id: 'cardano', name: 'Cardano', blockTimeMs: 20_000, blockTimeLabel: '~20s',
    color: '#0033AD', colorRgb: [0, 51, 173],
    primitives: [
      { id: 'plutus', name: 'Plutus', chainId: 'cardano' },
      { id: 'native-tokens', name: 'Native Tokens', chainId: 'cardano' },
      { id: 'nfts', name: 'NFTs', chainId: 'cardano' },
    ],
  },
  {
    id: 'near', name: 'NEAR', blockTimeMs: 1_200, blockTimeLabel: '~1.2s',
    color: '#00EC97', colorRgb: [0, 236, 151],
    primitives: [
      { id: 'nep141', name: 'NEP-141', chainId: 'near' },
      { id: 'ref-finance', name: 'Ref Finance', chainId: 'near' },
      { id: 'aurora', name: 'Aurora', chainId: 'near' },
    ],
  },
  {
    id: 'celestia', name: 'Celestia', blockTimeMs: 12_000, blockTimeLabel: '~12s',
    color: '#7B2BF9', colorRgb: [123, 43, 249],
    primitives: [
      { id: 'blobs', name: 'Blobs', chainId: 'celestia' },
      { id: 'namespaces', name: 'Namespaces', chainId: 'celestia' },
    ],
  },
  {
    id: 'avail', name: 'Avail', blockTimeMs: 20_000, blockTimeLabel: '~20s',
    color: '#2B6AFF', colorRgb: [43, 106, 255],
    primitives: [
      { id: 'app-data', name: 'App Data', chainId: 'avail' },
      { id: 'extrinsics', name: 'Extrinsics', chainId: 'avail' },
    ],
  },
  {
    id: 'other-evm', name: 'Other EVM', blockTimeMs: 6_000, blockTimeLabel: 'varies',
    color: '#888', colorRgb: [136, 136, 136],
    primitives: [
      { id: 'evm-erc20', name: 'ERC-20', chainId: 'other-evm' },
      { id: 'evm-erc721', name: 'ERC-721', chainId: 'other-evm' },
      { id: 'evm-erc1155', name: 'ERC-1155', chainId: 'other-evm' },
      { id: 'evm-events', name: 'Generic Events', chainId: 'other-evm' },
    ],
  },
]

// Log-scale compression for animation intervals
// Maps real block times to 0.8s–5s range
const MIN_BT = Math.min(...CHAINS.map(c => c.blockTimeMs))
const MAX_BT = Math.max(...CHAINS.map(c => c.blockTimeMs))
const BASE = 800
const RANGE = 4200

export function animationInterval(blockTimeMs: number): number {
  const logMin = Math.log(MIN_BT)
  const logMax = Math.log(MAX_BT)
  const t = (Math.log(blockTimeMs) - logMin) / (logMax - logMin)
  return BASE + RANGE * t
}
