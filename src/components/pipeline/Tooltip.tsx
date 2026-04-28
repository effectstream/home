import { useState, useRef, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  text: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

export default function Tooltip({ text, children, position = 'top' }: Props) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const wrapRef = useRef<HTMLSpanElement>(null)

  const enter = useCallback(() => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      setCoords({
        x: rect.left + rect.width / 2,
        y: position === 'top' ? rect.top - 8 : rect.bottom + 8,
      })
      setShow(true)
    }, 400)
  }, [position])

  const leave = useCallback(() => {
    clearTimeout(timeout.current)
    setShow(false)
  }, [])

  return (
    <span
      className="tip-wrap"
      ref={wrapRef}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {children}
      {show && createPortal(
        <span
          className="tip"
          style={{
            left: coords.x,
            transform: 'translateX(-50%)',
            ...(position === 'top'
              ? { bottom: window.innerHeight - coords.y, top: 'auto' }
              : { top: coords.y, bottom: 'auto' }
            ),
          }}
        >
          {text}
        </span>,
        document.body
      )}
    </span>
  )
}
