import React from 'react'

import ethLogo from '../assets/logos/ethereum.svg'
import polyLogo from '../assets/logos/polygon.svg'
import arbLogo from '../assets/logos/arbitrum.svg'
import opLogo from '../assets/logos/optimism.svg'
import baseLogo from '../assets/logos/base.svg'
import midLogo from '../assets/logos/midnight-white.svg'
import btcLogo from '../assets/logos/bitcoin.svg'
import adaLogo from '../assets/logos/cardano-white.svg'
import availLogo from '../assets/logos/avail.svg'
import nearLogo from '../assets/logos/near.svg'
import tiaLogo from '../assets/logos/celestia-white.svg'

const size = 16

const logo = (src: string, alt: string) => (
  <img key={alt} src={src} alt={alt} width={size} height={size} style={{ display: 'block' }} />
)

const evmLogos = [
  logo(ethLogo, 'Ethereum'),
  logo(polyLogo, 'Polygon'),
  logo(arbLogo, 'Arbitrum'),
  logo(opLogo, 'Optimism'),
  logo(baseLogo, 'Base'),
]

export const chainData: { name: string; logos: React.JSX.Element[]; more?: number }[] = [
  {
    name: 'EVM',
    logos: evmLogos,
    more: 15,
  },
  {
    name: 'Midnight',
    logos: [logo(midLogo, 'Midnight')],
  },
  {
    name: 'Bitcoin',
    logos: [logo(btcLogo, 'Bitcoin')],
  },
  {
    name: 'Cardano',
    logos: [logo(adaLogo, 'Cardano')],
  },
  {
    name: 'Avail',
    logos: [logo(availLogo, 'Avail')],
  },
  {
    name: 'NEAR',
    logos: [logo(nearLogo, 'NEAR')],
  },
  {
    name: 'Celestia',
    logos: [logo(tiaLogo, 'Celestia')],
  },
  {
    name: 'Easy to add more',
    logos: [
      <svg key="plus" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <path d="M12 7v10M7 12h10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>,
    ],
  },
]
