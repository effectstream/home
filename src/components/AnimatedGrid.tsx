import { useRef, useEffect } from 'react'

const CELL = 60
const MAX_ACTIVE = 60
const SPAWN_INTERVAL = 150 // ms between new cells lighting up

// Lifecycle durations in frames (at ~60fps)
// Total lifecycle: 2–5 seconds
const RISE_FRAMES = 18          // ~0.3s fade in
const HOLD_FRAMES_MIN = 60      // ~1s minimum hold
const HOLD_FRAMES_MAX = 180     // ~3s maximum hold
const FADE_FRAMES_MIN = 42      // ~0.7s minimum fade out
const FADE_FRAMES_MAX = 102     // ~1.7s maximum fade out

// Spark settings
const SPARK_MOVE_INTERVAL = 6   // frames between each grid step (~10 steps/sec)
const SPARK_SIZE = 3            // radius in px
const SPARK_GLOW = 12           // glow radius in px

type Phase = 'rising' | 'holding' | 'fading'
type Dir = 'up' | 'down' | 'left' | 'right'

interface ActiveCell {
  col: number
  row: number
  opacity: number
  peak: number
  phase: Phase
  holdLeft: number
  holdTotal: number   // original hold duration - used to detect midpoint
  fadeSpeed: number
  colorIdx: number
  sparkSpawned: boolean
}

interface Spark {
  col: number
  row: number
  // Pixel position for smooth interpolation between cells
  px: number
  py: number
  targetPx: number
  targetPy: number
  forward: Dir       // primary direction (towards nearest border)
  colorIdx: number
  moveTimer: number  // frames until next step
  opacity: number
}

const COLORS = [
  [6, 214, 160],    // cyan
  [139, 92, 246],   // purple
  [236, 72, 153],   // magenta
]

function colorWithOpacity(idx: number, opacity: number) {
  const [r, g, b] = COLORS[idx]
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

// Given a cell position, find which border is closest and return the direction
function nearestBorderDir(col: number, row: number, totalCols: number, totalRows: number): Dir {
  const distLeft = col
  const distRight = totalCols - 1 - col
  const distUp = row
  const distDown = totalRows - 1 - row
  const min = Math.min(distLeft, distRight, distUp, distDown)
  // Tie-break randomly among equals
  const candidates: Dir[] = []
  if (distLeft === min) candidates.push('left')
  if (distRight === min) candidates.push('right')
  if (distUp === min) candidates.push('up')
  if (distDown === min) candidates.push('down')
  return candidates[Math.floor(Math.random() * candidates.length)]
}

// Get the two perpendicular directions for a given forward direction
function sideDirs(forward: Dir): [Dir, Dir] {
  if (forward === 'up' || forward === 'down') return ['left', 'right']
  return ['up', 'down']
}

// Pick next direction: 60% forward, 20% each side, 0% back
function pickDirection(forward: Dir): Dir {
  const r = Math.random()
  const [sideA, sideB] = sideDirs(forward)
  if (r < 0.6) return forward
  if (r < 0.8) return sideA
  return sideB
}

// Apply a direction to a grid position
function step(col: number, row: number, dir: Dir): [number, number] {
  switch (dir) {
    case 'up': return [col, row - 1]
    case 'down': return [col, row + 1]
    case 'left': return [col - 1, row]
    case 'right': return [col + 1, row]
  }
}

// Center pixel of a cell
function cellCenter(col: number, row: number): [number, number] {
  return [col * CELL + CELL / 2, row * CELL + CELL / 2]
}

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    let raf: number
    let spawnTimer: ReturnType<typeof setInterval>
    const cells: ActiveCell[] = []
    const sparks: Spark[] = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const getCols = () => Math.ceil(canvas.offsetWidth / CELL)
    const getRows = () => Math.ceil(canvas.offsetHeight / CELL)

    // Draw the static grid lines
    const drawLines = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1

      ctx.beginPath()
      for (let x = 0; x <= w; x += CELL) {
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, h)
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(w, y + 0.5)
      }
      ctx.stroke()
    }

    // Apply radial mask
    const applyMask = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.globalCompositeOperation = 'destination-in'
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.55)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(0.6, 'rgba(0,0,0,0.7)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
    }

    // Spawn a new glowing cell
    const spawnCell = () => {
      if (cells.length >= MAX_ACTIVE) return
      const c = Math.floor(Math.random() * getCols())
      const r = Math.floor(Math.random() * getRows())
      if (cells.some(cell => cell.col === c && cell.row === r)) return

      const peak = 0.06 + Math.random() * 0.08
      const fadeFrames = randInt(FADE_FRAMES_MIN, FADE_FRAMES_MAX)
      const holdTotal = randInt(HOLD_FRAMES_MIN, HOLD_FRAMES_MAX)

      cells.push({
        col: c,
        row: r,
        opacity: 0,
        peak,
        phase: 'rising',
        holdLeft: holdTotal,
        holdTotal,
        fadeSpeed: peak / fadeFrames,
        colorIdx: Math.floor(Math.random() * COLORS.length),
        sparkSpawned: false,
      })
    }

    // Spawn a spark from a cell
    const spawnSpark = (cell: ActiveCell) => {
      const totalCols = getCols()
      const totalRows = getRows()
      const forward = nearestBorderDir(cell.col, cell.row, totalCols, totalRows)
      const [px, py] = cellCenter(cell.col, cell.row)

      sparks.push({
        col: cell.col,
        row: cell.row,
        px,
        py,
        targetPx: px,
        targetPy: py,
        forward,
        colorIdx: cell.colorIdx,
        moveTimer: 0,
        opacity: 1,
      })
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const totalCols = getCols()
      const totalRows = getRows()
      ctx.clearRect(0, 0, w, h)

      drawLines()

      // ── Update & draw cells ──
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i]

        switch (cell.phase) {
          case 'rising':
            cell.opacity += cell.peak / RISE_FRAMES
            if (cell.opacity >= cell.peak) {
              cell.opacity = cell.peak
              cell.phase = 'holding'
            }
            break
          case 'holding':
            cell.holdLeft--
            // Spawn spark at midpoint of hold
            if (!cell.sparkSpawned && cell.holdLeft <= cell.holdTotal / 2) {
              cell.sparkSpawned = true
              spawnSpark(cell)
            }
            if (cell.holdLeft <= 0) {
              cell.phase = 'fading'
            }
            break
          case 'fading':
            cell.opacity -= cell.fadeSpeed
            break
        }

        if (cell.opacity <= 0) {
          cells.splice(i, 1)
          continue
        }

        const x = cell.col * CELL
        const y = cell.row * CELL
        ctx.fillStyle = colorWithOpacity(cell.colorIdx, cell.opacity)
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
      }

      // ── Update & draw sparks ──
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]

        // Smoothly interpolate position towards target
        const lerpSpeed = 0.25
        spark.px += (spark.targetPx - spark.px) * lerpSpeed
        spark.py += (spark.targetPy - spark.py) * lerpSpeed

        // Step to next cell on timer
        spark.moveTimer--
        if (spark.moveTimer <= 0) {
          spark.moveTimer = SPARK_MOVE_INTERVAL

          const dir = pickDirection(spark.forward)
          const [nc, nr] = step(spark.col, spark.row, dir)

          // If out of bounds, kill the spark
          if (nc < 0 || nc >= totalCols || nr < 0 || nr >= totalRows) {
            sparks.splice(i, 1)
            continue
          }

          spark.col = nc
          spark.row = nr
          const [tx, ty] = cellCenter(nc, nr)
          spark.targetPx = tx
          spark.targetPy = ty
        }

        // Fade out as it nears a border
        const distToBorder = Math.min(spark.col, totalCols - 1 - spark.col, spark.row, totalRows - 1 - spark.row)
        spark.opacity = Math.min(1, distToBorder / 3)

        if (spark.opacity <= 0) {
          sparks.splice(i, 1)
          continue
        }

        // Draw glow
        const [r, g, b] = COLORS[spark.colorIdx]
        const glowGrad = ctx.createRadialGradient(spark.px, spark.py, 0, spark.px, spark.py, SPARK_GLOW)
        glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.4 * spark.opacity})`)
        glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = glowGrad
        ctx.fillRect(spark.px - SPARK_GLOW, spark.py - SPARK_GLOW, SPARK_GLOW * 2, SPARK_GLOW * 2)

        // Draw bright core dot
        ctx.beginPath()
        ctx.arc(spark.px, spark.py, SPARK_SIZE, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * spark.opacity})`
        ctx.fill()
      }

      applyMask()
      raf = requestAnimationFrame(draw)
    }

    // Pre-seed cells so the grid looks alive immediately on load
    const seedCount = 25
    const seedCols = getCols()
    const seedRows = getRows()
    for (let s = 0; s < seedCount; s++) {
      const c = Math.floor(Math.random() * seedCols)
      const r = Math.floor(Math.random() * seedRows)
      if (cells.some(cell => cell.col === c && cell.row === r)) continue

      const peak = 0.06 + Math.random() * 0.08
      const holdTotal = randInt(HOLD_FRAMES_MIN, HOLD_FRAMES_MAX)
      const fadeFrames = randInt(FADE_FRAMES_MIN, FADE_FRAMES_MAX)
      // Bias towards mid-lifecycle so most are visibly lit on first frame
      const progress = 0.15 + Math.random() * 0.55 // 0.15–0.70 → mostly in hold phase
      let phase: Phase
      let opacity: number
      let holdLeft: number
      let sparkSpawned: boolean

      if (progress < 0.15) {
        phase = 'rising'
        opacity = peak * (progress / 0.15)
        holdLeft = holdTotal
        sparkSpawned = false
      } else if (progress < 0.75) {
        phase = 'holding'
        opacity = peak
        const holdProgress = (progress - 0.15) / 0.6
        holdLeft = Math.round(holdTotal * (1 - holdProgress))
        sparkSpawned = holdProgress > 0.5
      } else {
        phase = 'fading'
        const fadeProgress = (progress - 0.75) / 0.25
        opacity = peak * (1 - fadeProgress)
        holdLeft = 0
        sparkSpawned = true
      }

      const colorIdx = Math.floor(Math.random() * COLORS.length)

      cells.push({
        col: c,
        row: r,
        opacity,
        peak,
        phase,
        holdLeft,
        holdTotal,
        fadeSpeed: peak / fadeFrames,
        colorIdx,
        sparkSpawned,
      })
    }

    // Pre-seed some sparks already in flight
    const sparkSeedCount = 3
    for (let s = 0; s < sparkSeedCount; s++) {
      const c = randInt(3, seedCols - 4)
      const r = randInt(3, seedRows - 4)
      const forward = nearestBorderDir(c, r, seedCols, seedRows)
      const [px, py] = cellCenter(c, r)
      sparks.push({
        col: c,
        row: r,
        px,
        py,
        targetPx: px,
        targetPy: py,
        forward,
        colorIdx: Math.floor(Math.random() * COLORS.length),
        moveTimer: randInt(1, SPARK_MOVE_INTERVAL),
        opacity: 1,
      })
    }

    spawnTimer = setInterval(spawnCell, SPAWN_INTERVAL)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(spawnTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
