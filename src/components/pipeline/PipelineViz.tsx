import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ChainSelector from './ChainSelector'
import PrimitivePanel from './PrimitivePanel'
import PipelineCanvas from './PipelineCanvas'
import Tooltip from './Tooltip'
import { CHAINS } from './data'
import './PipelineViz.css'

// All chains and all primitives enabled by default
const defaultChains = new Set(['ethereum', 'midnight', 'cardano', 'celestia'])
const defaultPrims = new Set(
  CHAINS.filter(c => defaultChains.has(c.id)).flatMap(c => c.primitives.map(p => p.id))
)

export default function PipelineViz() {
  const [enabledChains, setEnabledChains] = useState(defaultChains)
  const [enabledPrimitives, setEnabledPrimitives] = useState(defaultPrims)
  const rowsSpanRef = useRef<HTMLSpanElement>(null)

  const handleRows = useCallback((r: number) => {
    if (rowsSpanRef.current) rowsSpanRef.current.textContent = `${r} rows`
  }, [])

  const toggleChain = useCallback((id: string) => {
    setEnabledChains(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        // Auto-enable all primitives for the newly enabled chain
        const chain = CHAINS.find(c => c.id === id)
        if (chain) {
          setEnabledPrimitives(p => {
            const np = new Set(p)
            chain.primitives.forEach(pr => np.add(pr.id))
            return np
          })
        }
      }
      return next
    })
  }, [])

  const togglePrimitive = useCallback((id: string) => {
    setEnabledPrimitives(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <section className="section pipeline-section" id="pipeline">
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
          <span className="brand">EffectStream</span> collects data from multiple chains, syncs it into a unified state, then executes your logic deterministically. Toggle chains and primitives to see it live.
        </motion.p>

        <motion.div
          className="pipeline-layout"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ChainSelector enabledChains={enabledChains} onToggle={toggleChain} />
          <div className="canvas-labels">
            <div className="canvas-label-row">
              <span className="canvas-zone-anchor" style={{ left: '5%' }}>
                <Tooltip text="EffectStream connects to each blockchain via a Sync Protocol and reads blocks, transactions, and events in real time." position="bottom">
                  <span className="canvas-zone-label zone-label-cyan">Sync</span>
                </Tooltip>
              </span>
              <span className="canvas-zone-anchor" style={{ left: '18%' }}>
                <Tooltip text="The EffectStream L2 merges data from all connected chains into a single ordered stream of inputs." position="bottom">
                  <span className="canvas-zone-label zone-label-cyan"><span className="brand">EffectStream</span></span>
                </Tooltip>
              </span>
              <span className="canvas-zone-anchor" style={{ left: '44%' }}>
                <Tooltip text="Your custom logic runs here - state machines, callbacks, and scheduled tasks process the merged data deterministically." position="bottom">
                  <span className="canvas-zone-label zone-label-purple">State Machine</span>
                </Tooltip>
              </span>
              <span className="canvas-zone-anchor" style={{ left: '74%' }}>
                <Tooltip text="Processed state is written to your database. Query it with type-safe SQL." position="bottom">
                  <span className="canvas-zone-label zone-label-cyan">DB</span>
                </Tooltip>
              </span>
              <span className="canvas-zone-anchor" style={{ left: '88%' }}>
                <Tooltip text="Batcher Adapters submit transactions back to the source chains - settling results, updating contracts, or triggering on-chain actions." position="bottom">
                  <span className="canvas-zone-label zone-label-magenta">Batcher</span>
                </Tooltip>
              </span>
            </div>
            <div className="pipeline-canvas-wrap glass">
              <PipelineCanvas enabledChains={enabledChains} enabledPrimitives={enabledPrimitives} onRowsChange={handleRows} />
            </div>
            <div className="canvas-bottom-row">
              <span className="canvas-bottom-labels" style={{ left: '44%' }}>
                <span className="canvas-sub-label zone-label-purple">merge</span>
                <span className="canvas-sub-label zone-label-purple">transform</span>
                <span className="canvas-sub-label zone-label-purple">execute</span>
              </span>
              <span className="canvas-sub-label zone-label-cyan" style={{ left: '74%' }} ref={rowsSpanRef}>0 rows</span>
            </div>
          </div>
          <PrimitivePanel
            enabledChains={enabledChains}
            enabledPrimitives={enabledPrimitives}
            onToggle={togglePrimitive}
          />
        </motion.div>
      </div>
    </section>
  )
}
