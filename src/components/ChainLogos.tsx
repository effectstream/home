import React from 'react'

const size = 16

// EVM sub-chain logos
const evmLogos = [
  // Ethereum
  <svg key="eth" width={size} height={size} viewBox="0 0 256 417" fill="none">
    <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#8C8C8C" />
    <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#ccc" />
    <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z" fill="#8C8C8C" />
    <path d="M127.962 416.905v-104.72L0 236.585z" fill="#ccc" />
  </svg>,
  // Polygon
  <svg key="poly" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#8247e5" />
    <path d="M15.5 9.5L12 7 8.5 9.5v5L12 17l3.5-2.5v-5z" stroke="#fff" strokeWidth="1.5" fill="none" />
  </svg>,
  // Arbitrum
  <svg key="arb" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#28a0f0" />
    <path d="M12 6l5 6-5 6-5-6z" fill="#fff" />
  </svg>,
  // Optimism
  <svg key="op" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#ff0420" />
    <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">O</text>
  </svg>,
  // Base
  <svg key="base" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#0052ff" />
    <path d="M10.5 7a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM10.5 16a3.5 3.5 0 110-7" stroke="#fff" strokeWidth="1.5" fill="none" />
  </svg>,
]

// Individual chain logos
export const chainData: { name: string; logos: React.JSX.Element[]; more?: number }[] = [
  {
    name: 'EVM',
    logos: evmLogos,
    more: 15, // "+15 more" (~20 well-known EVM chains, 5 shown
  },
  {
    name: 'Midnight',
    logos: [
      <svg key="mid" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2" />
        <path d="M15 6a6 6 0 010 12A8 8 0 0015 6z" fill="#a78bfa" />
      </svg>,
    ],
  },
  {
    name: 'Bitcoin',
    logos: [
      <svg key="btc" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#f7931a" />
        <path
          d="M15.5 10.2c.2-1.5-.9-2.3-2.5-2.8l.5-2-1.2-.3-.5 2c-.3-.1-.6-.1-1-.2l.5-2L10.1 5l-.5 2c-.3 0-.5-.1-.7-.1l-1.7-.4-.3 1.3s.9.2.9.2c.5.1.6.4.6.7l-.6 2.5v.2c.1 0 .1 0 0 0l-.9-.2-.4 1.3 1.6.4c.3.1.6.1.9.2l-.5 2 1.2.3.5-2c.3.1.7.2 1 .2l-.5 2 1.2.3.5-2c2.1.4 3.6.2 4.3-1.6.5-1.5 0-2.3-1.1-2.8.8-.2 1.4-.7 1.5-1.8zm-2.7 3.8c-.4 1.5-2.8.7-3.6.5l.6-2.6c.8.2 3.4.6 3 2.1zm.4-3.8c-.3 1.4-2.4.7-3 .5l.6-2.3c.7.2 2.8.5 2.4 1.8z"
          fill="#fff"
        />
      </svg>,
    ],
  },
  {
    name: 'Cardano',
    logos: [
      <svg key="ada" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#0033ad" />
        <circle cx="12" cy="6" r="1.5" fill="#fff" />
        <circle cx="12" cy="18" r="1.5" fill="#fff" />
        <circle cx="6.8" cy="9" r="1.5" fill="#fff" />
        <circle cx="17.2" cy="9" r="1.5" fill="#fff" />
        <circle cx="6.8" cy="15" r="1.5" fill="#fff" />
        <circle cx="17.2" cy="15" r="1.5" fill="#fff" />
        <circle cx="12" cy="12" r="2" fill="#fff" />
      </svg>,
    ],
  },
  {
    name: 'Avail',
    logos: [
      <svg key="avl" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#2b6cb0" />
        <path d="M7 16l5-10 5 10H7z" fill="#fff" stroke="#fff" strokeWidth="0.5" strokeLinejoin="round" />
      </svg>,
    ],
  },
  {
    name: 'NEAR',
    logos: [
      <svg key="near" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#000" stroke="#fff" strokeWidth="0.5" />
        <path d="M8 17V7l8 10V7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,
    ],
  },
  {
    name: 'Celestia',
    logos: [
      <svg key="tia" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#7b2bf9" />
        <circle cx="12" cy="9" r="2.5" stroke="#fff" strokeWidth="1.5" fill="none" />
        <circle cx="8.5" cy="15" r="2.5" stroke="#fff" strokeWidth="1.5" fill="none" />
        <circle cx="15.5" cy="15" r="2.5" stroke="#fff" strokeWidth="1.5" fill="none" />
      </svg>,
    ],
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
