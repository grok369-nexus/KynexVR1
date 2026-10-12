import { useEffect, useMemo, useState } from 'react'

const G = 9.81
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export default function ProjectileLab() {
  const [speed, setSpeed] = useState(18)
  const [angle, setAngle] = useState(45)
  const [height, setHeight] = useState(0)
  const [gravity, setGravity] = useState(G)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)

  const model = useMemo(() => {
    const radians = angle * Math.PI / 180
    const ux = speed * Math.cos(radians)
    const uy = speed * Math.sin(radians)
    const flightTime = (uy + Math.sqrt(uy * uy + 2 * gravity * height)) / gravity
    const range = ux * flightTime
    const maxHeight = height + (uy * uy) / (2 * gravity)
    const maxTime = uy / gravity
    return { ux, uy, flightTime, range, maxHeight, maxTime }
  }, [speed, angle, height, gravity])

  useEffect(() => {
    setTime(0)
    setPlaying(false)
  }, [speed, angle, height, gravity])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setTime(current => Math.min(model.flightTime, current + 0.035))
    }, 35)
    return () => window.clearInterval(timer)
  }, [playing, model.flightTime])

  useEffect(() => {
    if (playing && time >= model.flightTime) setPlaying(false)
  }, [playing, time, model.flightTime])

  const t = clamp(time, 0, model.flightTime)
  const ballX = model.ux * t
  const ballY = height + model.uy * t - 0.5 * gravity * t * t
  const scaleX = 500 / Math.max(model.range, 1)
  const scaleY = 205 / Math.max(model.maxHeight, 1)
  const pointX = (x: number) => 34 + x * scaleX
  const pointY = (y: number) => 265 - y * scaleY
  const trajectory = Array.from({ length: 51 }, (_, i) => {
    const sampleT = model.flightTime * i / 50
    const x = model.ux * sampleT
    const y = Math.max(0, height + model.uy * sampleT - 0.5 * gravity * sampleT * sampleT)
    return `${i === 0 ? 'M' : 'L'} ${pointX(x).toFixed(2)} ${pointY(y).toFixed(2)}`
  }).join(' ')
  const currentSpeed = Math.hypot(model.ux, model.uy - gravity * t)
  const currentHeight = Math.max(0, ballY)

  return <div className="ph-lab">
    <div className="ph-sim-canvas">
      <div className="ph-canvas-label"><span className="ph-live-dot" /> IDEAL PROJECTILE · AIR RESISTANCE OFF</div>
      <svg viewBox="0 0 580 300" role="img" aria-label="Projectile trajectory with launch angle, velocity and live position">
        <defs>
          <marker id="ph-projectile-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#72e4c4" /></marker>
        </defs>
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1="25" x2="560" y1={55 + i * 40} y2={55 + i * 40} stroke="#203b47" strokeWidth="1" />)}
        <line x1="25" y1="265" x2="560" y2="265" stroke="#7c9aa5" strokeWidth="2" />
        <path d={trajectory} fill="none" stroke="#72e4c4" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 5" />
        <line x1={pointX(0)} y1={pointY(height)} x2={pointX(0) + 52 * Math.cos(angle * Math.PI / 180)} y2={pointY(height) - 52 * Math.sin(angle * Math.PI / 180)} stroke="#f1bd69" strokeWidth="2.5" markerEnd="url(#ph-projectile-arrow)" />
        <path d={`M ${pointX(0) + 25} ${pointY(height)} A 25 25 0 0 0 ${pointX(0) + 25 * Math.cos(angle * Math.PI / 180)} ${pointY(height) - 25 * Math.sin(angle * Math.PI / 180)}`} fill="none" stroke="#f1bd69" strokeWidth="1.5" />
        <line x1={pointX(ballX)} y1={pointY(currentHeight)} x2={pointX(ballX)} y2="265" stroke="#5c8290" strokeDasharray="4 5" />
        <circle cx={pointX(ballX)} cy={pointY(currentHeight)} r="7" fill="#f1bd69" stroke="#fff0ce" strokeWidth="2" />
        <text x="28" y="287" fill="#8faab5" fontSize="11">Launch</text>
        <text x="490" y="287" fill="#8faab5" fontSize="11">Range →</text>
        <text x={pointX(0) + 30} y={pointY(height) - 13} fill="#f1bd69" fontSize="12">{angle}°</text>
        <text x="36" y="32" fill="#a6c0c9" fontSize="11">y (m)</text>
      </svg>
      <div className="ph-playback">
        <button className="ph-action-button" onClick={() => { if (time >= model.flightTime) setTime(0); setPlaying(value => !value) }}>{playing ? 'Ⅱ Pause' : '▶ Play flight'}</button>
        <button className="ph-action-button secondary" onClick={() => { setPlaying(false); setTime(0) }}>↺ Reset</button>
        <label className="ph-time-control">Time <strong>{t.toFixed(2)} s</strong><input aria-label="Projectile time" type="range" min="0" max={Math.max(model.flightTime, 0.01)} step="0.01" value={t} onChange={e => { setPlaying(false); setTime(Number(e.target.value)) }} /></label>
      </div>
    </div>
    <div className="ph-controls">
      <label>Launch speed <strong>{speed} m/s</strong><input type="range" min="2" max="30" step="1" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label>
      <label>Launch angle <strong>{angle}°</strong><input type="range" min="10" max="80" step="1" value={angle} onChange={e => setAngle(Number(e.target.value))} /></label>
      <label>Launch height <strong>{height.toFixed(1)} m</strong><input type="range" min="0" max="10" step="0.5" value={height} onChange={e => setHeight(Number(e.target.value))} /></label>
      <label>Gravity <strong>{gravity.toFixed(2)} m/s²</strong><input type="range" min="1" max="15" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} /></label>
    </div>
    <div className="ph-readouts">
      <div><span>Horizontal range</span><strong>{model.range.toFixed(2)} <small>m</small></strong></div>
      <div><span>Flight time</span><strong>{model.flightTime.toFixed(2)} <small>s</small></strong></div>
      <div><span>Maximum height</span><strong>{model.maxHeight.toFixed(2)} <small>m</small></strong></div>
      <div><span>Speed now</span><strong>{currentSpeed.toFixed(2)} <small>m/s</small></strong></div>
    </div>
    <div className="ph-explanation">
      <strong>Equations used</strong>
      <span>uₓ = u cos θ · uᵧ = u sin θ</span>
      <span>y = h + uᵧt − ½gt² · R = uₓt<sub>flight</sub></span>
      <p>Assumes uniform gravity and no air resistance. Change one variable at a time and predict the result before pressing Play.</p>
    </div>
  </div>
}
