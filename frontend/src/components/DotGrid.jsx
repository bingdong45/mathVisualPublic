import React, { useEffect, useRef } from 'react'

const SPACING    = 28      // px between dot centres
const DOT_RADIUS = 2       // dot size in px — bigger = more visible
const BASE_ALPHA = 0.3    // resting opacity — dark enough to clearly see
const FADE_DIST  = 210     // px radius around cursor where dots fade out
const MIN_ALPHA  = 0.15    // how faint dots get at cursor centre (never fully gone)

export default function DotGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let mouseX   = -9999
    let mouseY   = -9999
    let rafId

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let x = SPACING / 2; x < canvas.width + SPACING; x += SPACING) {
        for (let y = SPACING / 2; y < canvas.height + SPACING; y += SPACING) {
          const dx   = x - mouseX
          const dy   = y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)

          let alpha
          if (dist < FADE_DIST) {
            // Smooth erase: quadratic ease from MIN_ALPHA at centre → BASE_ALPHA at edge
            const t = dist / FADE_DIST
            alpha = MIN_ALPHA + (BASE_ALPHA - MIN_ALPHA) * (t * t)
          } else {
            alpha = BASE_ALPHA
          }

          ctx.beginPath()
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(67, 97, 238, ${alpha})`
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    function onMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    function onLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    resize()
    draw()

    window.addEventListener('mousemove',    onMove)
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize',       resize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove',    onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize',       resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
