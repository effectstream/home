import { useRef, useEffect } from 'react'
import { CHAINS, animationInterval } from './data'
import type { ChainConfig } from './data'

interface Props {
  enabledChains: Set<string>
  enabledPrimitives: Set<string>
  onRowsChange?: (rows: number) => void
}

// ── Entities ──
type BlockStage = 'chain' | 'merging' | 'queued' | 'processing' | 'storing' | 'absorbed' | 'done'

interface Block {
  chainId: string
  x: number
  y: number
  targetY: number
  targetX: number
  absorber: Block | null  // live reference to the block absorbing this one
  color: [number, number, number]
  opacity: number
  size: number
  filled: boolean
  stage: BlockStage
  mergeGroup: number
}

interface WriteBack {
  chainId: string
  chainName: string
  x: number
  y: number
  startY: number
  targetY: number
  color: [number, number, number]
  opacity: number
  size: number
  stage: 'traveling' | 'arriving' | 'done'
  arriveTimer: number  // frames left in arrive flash
}

const MAX_BLOCKS = 100
const BLOCK_SPEED = 0.0035
const WRITEBACK_SPEED = 0.0042

export default function PipelineCanvas({ enabledChains, enabledPrimitives, onRowsChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ enabledChains, enabledPrimitives })
  const onRowsRef = useRef(onRowsChange)
  onRowsRef.current = onRowsChange

  useEffect(() => {
    stateRef.current = { enabledChains, enabledPrimitives }
  }, [enabledChains, enabledPrimitives])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    let raf: number
    const blocks: Block[] = []
    const writebacks: WriteBack[] = []
    const timers: Map<string, number> = new Map()
    let rows = 0
    let mergeCounter = 0
    let lastWritebackTime = 0
    let frameCount = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = () => canvas.offsetWidth
    const h = () => canvas.offsetHeight

    function getChainY(chainId: string): number {
      const enabled = CHAINS.filter(c => stateRef.current.enabledChains.has(c.id))
      const idx = enabled.findIndex(c => c.id === chainId)
      if (idx === -1 || enabled.length === 0) return h() / 2
      const spacing = h() / (enabled.length + 1)
      return spacing * (idx + 1)
    }

    function getChain(id: string): ChainConfig | undefined {
      return CHAINS.find(c => c.id === id)
    }

    function hasEnabledPrimitives(chainId: string): boolean {
      const chain = getChain(chainId)
      if (!chain) return false
      return chain.primitives.some(p => stateRef.current.enabledPrimitives.has(p.id))
    }

    // ── Zone boundaries ──
    const ZONE_MERGE = 0.18
    const ZONE_SM_START = 0.26
    const ZONE_SM_END = 0.62
    const ZONE_DB = 0.74
    const ZONE_BATCHER = 0.88

    // ── Spawn inbound blocks ──
    function trySpawn(now: number) {
      const { enabledChains: ec } = stateRef.current
      for (const chain of CHAINS) {
        if (!ec.has(chain.id)) continue
        const baseInterval = animationInterval(chain.blockTimeMs)
        // Add ±30% random jitter so chains with same block time don't sync
        const jitter = baseInterval * (0.7 + Math.random() * 0.6)
        const last = timers.get(chain.id) || (now - Math.random() * baseInterval)
        if (now - last < jitter) continue
        if (blocks.filter(b => b.stage !== 'done').length >= MAX_BLOCKS) continue

        timers.set(chain.id, now)
        const y = getChainY(chain.id)

        // Assign merge group — every 3-5 blocks get the same group
        if (Math.random() < 0.3) mergeCounter++

        let block = blocks.find(b => b.stage === 'done')
        if (!block) {
          block = {} as Block
          blocks.push(block)
        }
        Object.assign(block, {
          chainId: chain.id,
          x: 0,
          y,
          targetY: y,
          targetX: 0,
          absorber: null,
          color: chain.colorRgb,
          opacity: 1,
          size: 8 + Math.random() * 4,
          filled: hasEnabledPrimitives(chain.id),
          stage: 'chain',
          mergeGroup: mergeCounter,
        })
      }
    }

    // ── Spawn writeback blocks ──
    function trySpawnWriteback(now: number) {
      const { enabledChains: ec } = stateRef.current
      const enabled = CHAINS.filter(c => ec.has(c.id))
      if (enabled.length === 0) return
      if (now - lastWritebackTime < 2000) return
      if (rows < 1) return

      lastWritebackTime = now
      const chain = enabled[Math.floor(Math.random() * enabled.length)]
      const targetY = getChainY(chain.id)
      const startY = h() / 2

      let wb = writebacks.find(w => w.stage === 'done')
      if (!wb) {
        wb = {} as WriteBack
        writebacks.push(wb)
      }
      Object.assign(wb, {
        chainId: chain.id,
        chainName: chain.name,
        x: ZONE_BATCHER,
        y: startY,
        startY,
        targetY,
        color: chain.colorRgb,
        opacity: 1,
        size: 8,
        stage: 'traveling',
        arriveTimer: 0,
      })
    }

    // ── Draw scaffolding ──
    function drawScaffolding() {
      const cw = w()
      const ch = h()
      const { enabledChains: ec } = stateRef.current

      // Guide lines from chains to merge
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      for (const chain of CHAINS) {
        if (!ec.has(chain.id)) continue
        const y = getChainY(chain.id)
        ctx.beginPath()
        ctx.moveTo(56, y)
        ctx.lineTo(cw * ZONE_MERGE, y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Merge column
      ctx.strokeStyle = 'rgba(6, 214, 160, 0.1)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cw * ZONE_MERGE, 30)
      ctx.lineTo(cw * ZONE_MERGE, ch - 20)
      ctx.stroke()

      // Merge column glow pulse
      const pulse = 0.06 + Math.sin(frameCount * 0.03) * 0.03
      const mergeGlow = ctx.createRadialGradient(
        cw * ZONE_MERGE, ch / 2, 0,
        cw * ZONE_MERGE, ch / 2, 60
      )
      mergeGlow.addColorStop(0, `rgba(6, 214, 160, ${pulse})`)
      mergeGlow.addColorStop(1, 'rgba(6, 214, 160, 0)')
      ctx.fillStyle = mergeGlow
      ctx.fillRect(cw * ZONE_MERGE - 60, ch / 2 - 60, 120, 120)

      // Connecting line: merge → SM
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.moveTo(cw * ZONE_MERGE + 10, ch / 2)
      ctx.lineTo(cw * ZONE_SM_START - 4, ch / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // State Machine box
      const smX = cw * ZONE_SM_START
      const smW = cw * (ZONE_SM_END - ZONE_SM_START)
      const smY = ch / 2 - 50
      const smH = 100

      // SM background fill
      ctx.fillStyle = 'rgba(139, 92, 246, 0.03)'
      roundedRect(ctx, smX, smY, smW, smH, 14)
      ctx.fill()

      // SM border
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)'
      ctx.lineWidth = 1.5
      roundedRect(ctx, smX, smY, smW, smH, 14)
      ctx.stroke()

      // (SM label removed — now a DOM overlay above the canvas)

      // (SM sub-labels removed — now DOM overlays below canvas)

      // Animated gear
      drawGear(ctx, smX + smW / 2, ch / 2, 16, 'rgba(139, 92, 246, 0.15)', frameCount * 0.5)

      // Connecting line: SM → DB
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.moveTo(cw * ZONE_SM_END + 4, ch / 2)
      ctx.lineTo(cw * ZONE_DB - 24, ch / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // DB cylinder
      const dbCenterX = cw * ZONE_DB
      const dbW = 36
      const dbH = 44
      const dbTopY = ch / 2 - dbH / 2
      drawCylinder(ctx, dbCenterX, dbTopY, dbW, dbH, 'rgba(6, 214, 160, 0.08)', 'rgba(6, 214, 160, 0.18)')

      // (DB label + rows counter removed — now DOM overlays)

      // Batcher column line (like the EffectStream merge column)
      const batcherX = cw * ZONE_BATCHER
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.1)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(batcherX, 30)
      ctx.lineTo(batcherX, ch - 20)
      ctx.stroke()

      // Batcher column glow pulse
      const batcherPulse = 0.05 + Math.sin(frameCount * 0.025 + 1) * 0.025
      const batcherGlow = ctx.createRadialGradient(
        batcherX, ch / 2, 0,
        batcherX, ch / 2, 50
      )
      batcherGlow.addColorStop(0, `rgba(236, 72, 153, ${batcherPulse})`)
      batcherGlow.addColorStop(1, 'rgba(236, 72, 153, 0)')
      ctx.fillStyle = batcherGlow
      ctx.fillRect(batcherX - 50, ch / 2 - 50, 100, 100)

      // Connecting line: DB → Batcher
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.06)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      ctx.beginPath()
      ctx.moveTo(cw * ZONE_DB + 22, ch / 2)
      ctx.lineTo(batcherX - 10, ch / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Batcher → chain writeback guide lines
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.03)'
      ctx.setLineDash([3, 6])
      for (const chain of CHAINS) {
        if (!ec.has(chain.id)) continue
        const y = getChainY(chain.id)
        ctx.beginPath()
        ctx.moveTo(batcherX, ch / 2)
        ctx.quadraticCurveTo(batcherX + 30, y, cw - 10, y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Chain labels on left
      for (const chain of CHAINS) {
        if (!ec.has(chain.id)) continue
        const y = getChainY(chain.id)
        ctx.font = '600 9px "Inter", sans-serif'
        ctx.fillStyle = `rgba(${chain.colorRgb.join(',')}, 0.6)`
        ctx.textAlign = 'right'
        ctx.fillText(chain.name, 52, y + 3)
      }
    }

    // ── Update & draw inbound blocks ──
    function updateBlocks() {
      const cw = w()
      const ch = h()
      const mergeY = ch / 2

      for (const block of blocks) {
        if (block.stage === 'done') continue

        block.filled = hasEnabledPrimitives(block.chainId)
        block.x += BLOCK_SPEED

        // Stage transitions
        if (block.stage === 'chain' && block.x >= ZONE_MERGE - 0.02) {
          block.stage = 'merging'
          block.targetY = mergeY
        }
        if (block.stage === 'merging' && block.x >= ZONE_MERGE + 0.01) {
          block.stage = 'queued'
        }
        if (block.stage === 'queued' && block.x >= ZONE_SM_START) {
          block.stage = 'processing'
          // Merge: nearby blocks shrink and fade into this one
          for (const other of blocks) {
            if (other === block || other.stage !== 'queued') continue
            if (Math.abs(other.x - block.x) < 0.06) {
              other.stage = 'absorbed'
              other.absorber = block
              block.size = Math.min(block.size + 2, 18)
            }
          }
        }
        // Absorbed blocks shrink and fade toward absorber's live position
        if (block.stage === 'absorbed') {
          const ax = block.absorber ? block.absorber.x : block.targetX
          const ay = block.absorber ? block.absorber.y : block.targetY
          block.x += (ax - block.x) * 0.15
          block.y += (ay - block.y) * 0.15
          block.opacity -= 0.05
          block.size *= 0.92
          if (block.opacity <= 0 || block.size < 1) {
            block.stage = 'done'
            rows++
            continue
          }
        }
        if (block.stage === 'processing' && block.x >= ZONE_SM_END) {
          block.stage = 'storing'
        }
        if (block.stage === 'storing' && block.x >= ZONE_DB + 0.03) {
          block.stage = 'done'
          rows++
          continue
        }

        // Y convergence
        if (block.stage !== 'chain') {
          block.y += (block.targetY - block.y) * 0.06
        }

        // Fade during storing
        if (block.stage === 'storing') {
          block.opacity -= 0.025
          block.size *= 0.985
        }

        if (block.opacity <= 0) {
          block.stage = 'done'
          rows++
          continue
        }

        // ── Draw ──
        const px = 56 + block.x * (cw - 80)
        const py = block.y + Math.sin(block.x * 18) * 2

        // Color changes per stage
        let r: number, g: number, b: number
        if (block.stage === 'processing') {
          // Blend from original color toward purple during processing
          const t = (block.x - ZONE_SM_START) / (ZONE_SM_END - ZONE_SM_START)
          r = block.color[0] + (139 - block.color[0]) * t
          g = block.color[1] + (92 - block.color[1]) * t
          b = block.color[2] + (246 - block.color[2]) * t
        } else if (block.stage === 'storing') {
          r = 6; g = 214; b = 160 // cyan after processing
        } else if (block.stage === 'queued') {
          // Flash white briefly at merge point
          r = 200; g = 220; b = 255
        } else {
          [r, g, b] = block.color
        }

        // Glow
        const glowRadius = block.size * 2.5
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowRadius)
        grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${0.2 * block.opacity})`)
        grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(px - glowRadius, py - glowRadius, glowRadius * 2, glowRadius * 2)

        // Block body
        const half = block.size / 2
        roundedRect(ctx, px - half, py - half, block.size, block.size, 3)
        if (block.filled) {
          ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${0.7 * block.opacity})`
          ctx.fill()
        } else {
          ctx.strokeStyle = `rgba(${r|0},${g|0},${b|0},${0.5 * block.opacity})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // Processing effects — orbiting particles + size pulse
        if (block.stage === 'processing') {
          const smProgress = (block.x - ZONE_SM_START) / (ZONE_SM_END - ZONE_SM_START)
          const time = frameCount * 0.08
          const numParticles = 4 + Math.floor(smProgress * 3)
          for (let i = 0; i < numParticles; i++) {
            const angle = time + i * (Math.PI * 2 / numParticles)
            const orbitR = block.size + 3 + smProgress * 6
            const dx = Math.cos(angle) * orbitR
            const dy = Math.sin(angle) * orbitR
            ctx.beginPath()
            ctx.arc(px + dx, py + dy, 1 + smProgress, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(139, 92, 246, ${(0.5 + smProgress * 0.3) * block.opacity})`
            ctx.fill()
          }

          // Size breathe
          block.size += Math.sin(frameCount * 0.1) * 0.05
        }
      }
    }

    // ── Update & draw writeback blocks ──
    function updateWritebacks() {
      const cw = w()
      const ch = h()

      for (const wb of writebacks) {
        if (wb.stage === 'done') continue

        if (wb.stage === 'arriving') {
          wb.arriveTimer--
          if (wb.arriveTimer <= 0) {
            wb.stage = 'done'
            continue
          }

          // Draw arrival burst ring at the chain lane edge
          const burstX = cw - 20
          const burstY = wb.targetY
          const [r, g, b] = wb.color
          const t = 1 - wb.arriveTimer / 40 // 0→1
          const radius = 8 + t * 25
          const alpha = (1 - t) * 0.6

          // Expanding ring
          ctx.beginPath()
          ctx.arc(burstX, burstY, radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.lineWidth = 2
          ctx.stroke()

          // Inner flash
          const innerGrad = ctx.createRadialGradient(burstX, burstY, 0, burstX, burstY, 15)
          innerGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(1 - t) * 0.3})`)
          innerGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = innerGrad
          ctx.fillRect(burstX - 15, burstY - 15, 30, 30)

          // Chain name flash
          ctx.font = '700 10px "Inter", sans-serif'
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(1 - t) * 0.8})`
          ctx.textAlign = 'center'
          ctx.fillText(`→ ${wb.chainName}`, burstX - 30, burstY - 16)

          continue
        }

        // ── Traveling ──
        wb.x += WRITEBACK_SPEED

        // Interpolate Y toward target chain lane
        const progress = (wb.x - ZONE_BATCHER) / (1 - ZONE_BATCHER)
        wb.y = wb.startY + (wb.targetY - wb.startY) * Math.min(1, progress * 1.8)

        // Arrive at chain edge
        if (wb.x >= 0.97) {
          wb.stage = 'arriving'
          wb.arriveTimer = 40
          continue
        }

        // Draw
        const px = 56 + wb.x * (cw - 80)
        const py = wb.y
        const [r, g, b] = wb.color

        // Glow — single chain color
        const glowR = wb.size * 3.5
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.3 * wb.opacity})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(px - glowR, py - glowR, glowR * 2, glowR * 2)

        // Arrow-like triangle shape
        ctx.beginPath()
        const s = wb.size
        ctx.moveTo(px + s, py)
        ctx.lineTo(px - s * 0.5, py - s * 0.55)
        ctx.lineTo(px - s * 0.5, py + s * 0.55)
        ctx.closePath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.75 * wb.opacity})`
        ctx.fill()

        // "TX" label next to arrow
        ctx.font = '700 7px "JetBrains Mono", monospace'
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.7 * wb.opacity})`
        ctx.textAlign = 'left'
        ctx.fillText('TX', px + s + 4, py + 3)

        // Chain name tag above
        ctx.font = '600 8px "Inter", sans-serif'
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.6 * wb.opacity})`
        ctx.textAlign = 'center'
        ctx.fillText(wb.chainName, px, py - s - 4)

        // Trail particles — same chain color
        for (let t = 1; t <= 5; t++) {
          const tx = px - t * 7
          const trailAlpha = (0.35 - t * 0.06) * wb.opacity
          ctx.beginPath()
          ctx.arc(tx, py + Math.sin(t + frameCount * 0.1) * 1.5, 2 - t * 0.25, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, trailAlpha)})`
          ctx.fill()
        }
      }
    }

    // ── Main loop ──
    function draw(now: number) {
      const cw = w()
      const ch = h()
      ctx.clearRect(0, 0, cw, ch)
      frameCount++

      trySpawn(now)
      trySpawnWriteback(now)
      drawScaffolding()
      updateBlocks()
      updateWritebacks()

      // Report rows to parent (throttled — every 30 frames)
      if (frameCount % 30 === 0) {
        onRowsRef.current?.(rows)
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pipeline-canvas" />
}

// ── Canvas draw helpers ──

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawGear(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, rotation: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rotation)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  // Inner circle
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2)
  ctx.stroke()
  // Teeth
  const teeth = 8
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2
    const x1 = Math.cos(angle) * r * 0.45
    const y1 = Math.sin(angle) * r * 0.45
    const x2 = Math.cos(angle) * r * 0.75
    const y2 = Math.sin(angle) * r * 0.75
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  // Outer circle
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawCylinder(
  ctx: CanvasRenderingContext2D,
  cx: number, topY: number,
  w: number, h: number,
  fill: string, stroke: string,
) {
  const rx = w / 2
  const ry = 8
  const botY = topY + h

  ctx.fillStyle = fill
  ctx.fillRect(cx - rx, topY + ry, w, h - ry)

  ctx.beginPath()
  ctx.ellipse(cx, botY, rx, ry, 0, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx - rx, topY + ry)
  ctx.lineTo(cx - rx, botY)
  ctx.moveTo(cx + rx, topY + ry)
  ctx.lineTo(cx + rx, botY)
  ctx.strokeStyle = stroke
  ctx.stroke()

  ctx.beginPath()
  ctx.ellipse(cx, topY + ry, rx, ry, 0, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.stroke()
}
