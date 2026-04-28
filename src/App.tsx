import { useRef, useEffect, useState } from 'react'
import AnimatedGrid from './components/AnimatedGrid'
import Header from './components/Header'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import PipelineViz from './components/pipeline/PipelineViz'
import QuickStart from './components/QuickStart'
import DevStack from './components/DevStack'
import Templates from './components/Templates'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!backdropRef.current) return
      const rect = backdropRef.current.getBoundingClientRect()
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <>
      <Header />
      {/* Shared backdrop: aurora + grid spanning Hero and Bento */}
      <div className="backdrop" ref={backdropRef}>
        <div className="backdrop-aurora">
          <div
            className="aurora-blob blob-cyan"
            style={{ transform: `translate(${mouse.x * 30 - 15}%, ${mouse.y * 30 - 15}%)` }}
          />
          <div
            className="aurora-blob blob-purple"
            style={{ transform: `translate(${-mouse.x * 25 + 12}%, ${-mouse.y * 20 + 10}%)` }}
          />
          <div
            className="aurora-blob blob-magenta"
            style={{ transform: `translate(${mouse.x * 20 - 10}%, ${-mouse.y * 25 + 12}%)` }}
          />
        </div>
        <AnimatedGrid />

        <Hero />
        <BentoGrid />
      </div>

      <PipelineViz />
      <QuickStart />
      <DevStack />
      <Templates />
      <Footer />
    </>
  )
}
