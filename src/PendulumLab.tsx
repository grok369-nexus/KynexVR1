import { useEffect, useMemo, useState } from 'react'

export default function PendulumLab() {
  const [length, setLength] = useState(1.2)
  const [mass, setMass] = useState(0.5)
  const [amplitude, setAmplitude] = useState(25)
  const [gravity, setGravity] = useState(9.81)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)

  const model = useMemo(() => {
    const omega = Math.sqrt(gravity / length)
    const period = 2 * Math.PI / omega
    const theta0 = amplitude * Math.PI / 180
    const maxSpeed = Math.sqrt(2 * gravity * length * (1 - Math.cos(theta0)))
    return { omega, period, theta0, maxSpeed, frequency: 1 / period }
  }, [length, amplitude, gravity])

  useEffect(() => { setTime(0); setPlaying(false) }, [length, amplitude, gravity])
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setTime(current => (current + 0.025) % model.period), 25)
    return () => window.clearInterval(timer)
  }, [playing, model.period])

  const angleNow = model.theta0 * Math.cos(model.omega * time)
  const angularVelocity = -model.theta0 * model.omega * Math.sin(model.omega * time)
  const currentSpeed = Math.abs(length * angularVelocity)
  const currentTension = mass * gravity * Math.cos(angleNow) + mass * length * angularVelocity * angularVelocity
  const radius = 55 + length / 2.5 * 80
  const pivotX = 290
  const pivotY = 35
  const bobX = pivotX + radius * Math.sin(angleNow)
  const bobY = pivotY + radius * Math.cos(angleNow)
  const leftX = pivotX - radius * Math.sin(model.theta0)
  const rightX = pivotX + radius * Math.sin(model.theta0)

  return <div className="ph-lab">
    <div className="ph-sim-canvas">
      <div className="ph-canvas-label"><span className="ph-live-dot" /> SIMPLE PENDULUM · SMALL-ANGLE APPROXIMATION</div>
      <svg viewBox="0 0 580 300" role="img" aria-label="Pendulum bob swinging from a fixed pivot">
        <defs>
          <marker id="ph-pendulum-weight-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f1bd69" /></marker>
          <marker id="ph-pendulum-tension-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7db7ff" /></marker>
        </defs>
        <path d={`M ${leftX} ${pivotY + radius * Math.cos(model.theta0)} A ${radius} ${radius} 0 0 1 ${rightX} ${pivotY + radius * Math.cos(model.theta0)}`} fill="none" stroke="#365562" strokeWidth="2" strokeDasharray="5 5" />
        <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + radius + 12} stroke="#547581" strokeDasharray="4 5" />
        <path d={`M ${pivotX - 20} ${pivotY} L ${pivotX + 20} ${pivotY} L ${pivotX} ${pivotY + 13} Z`} fill="#426573" stroke="#82a4af" />
        <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#b9d0d7" strokeWidth="3" strokeLinecap="round" />
        <line x1={bobX} y1={bobY} x2={bobX} y2={bobY + 50} stroke="#f1bd69" strokeWidth="2.5" markerEnd="url(#ph-pendulum-weight-arrow)" />
        <line x1={bobX} y1={bobY} x2={bobX + (pivotX - bobX) * 0.42} y2={bobY + (pivotY - bobY) * 0.42} stroke="#7db7ff" strokeWidth="2.5" markerEnd="url(#ph-pendulum-tension-arrow)" />
        <circle cx={pivotX} cy={pivotY} r="5" fill="#e1f0f2" />
        <circle cx={bobX} cy={bobY} r="17" fill="#72e4c4" stroke="#d7fff4" strokeWidth="2" />
        <text x={bobX} y={bobY + 4} fill="#0b242b" fontSize="10" textAnchor="middle" fontWeight="700">{mass}kg</text>
        <text x={bobX + 12} y={bobY + 62} fill="#f1bd69" fontSize="12">mg</text>
        <text x={bobX + (pivotX - bobX) * 0.38 + 6} y={bobY + (pivotY - bobY) * 0.38} fill="#7db7ff" fontSize="12">T</text>
        <text x="25" y="28" fill="#a6c0c9" fontSize="11">Swinging bob · force arrows shown</text>
        <text x="310" y="66" fill="#f1bd69" fontSize="12">{(angleNow * 180 / Math.PI).toFixed(1)}°</text>
        <text x="22" y="282" fill="#8faab5" fontSize="11">Blue: tension · Gold: weight</text>
      </svg>
      <div className="ph-playback">
        <button className="ph-action-button" onClick={() => setPlaying(value => !value)}>{playing ? 'Ⅱ Pause' : '▶ Start swinging'}</button>
        <button className="ph-action-button secondary" onClick={() => { setPlaying(false); setTime(0) }}>↺ Reset</button>
        <label className="ph-time-control">Time <strong>{time.toFixed(2)} s</strong><input aria-label="Pendulum time" type="range" min="0" max={model.period} step="0.01" value={Math.min(time, model.period)} onChange={e => { setPlaying(false); setTime(Number(e.target.value)) }} /></label>
      </div>
    </div>
    <div className="ph-controls">
      <label>String length <strong>{length.toFixed(2)} m</strong><input type="range" min="0.3" max="2.5" step="0.1" value={length} onChange={e => setLength(Number(e.target.value))} /></label>
      <label>Bob mass <strong>{mass.toFixed(1)} kg</strong><input type="range" min="0.1" max="3" step="0.1" value={mass} onChange={e => setMass(Number(e.target.value))} /></label>
      <label>Initial angle <strong>{amplitude}°</strong><input type="range" min="5" max="40" step="1" value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} /></label>
      <label>Gravity <strong>{gravity.toFixed(2)} m/s²</strong><input type="range" min="1" max="15" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} /></label>
    </div>
    <div className="ph-readouts">
      <div><span>Period</span><strong>{model.period.toFixed(3)} <small>s</small></strong></div>
      <div><span>Frequency</span><strong>{model.frequency.toFixed(3)} <small>Hz</small></strong></div>
      <div><span>Maximum speed</span><strong>{model.maxSpeed.toFixed(2)} <small>m/s</small></strong></div>
      <div><span>Tension now</span><strong>{currentTension.toFixed(2)} <small>N</small></strong></div>
    </div>
    <div className="ph-explanation">
      <strong>Equations used</strong>
      <span>T = 2π√(L/g) · f = 1/T</span>
      <span>vₘₐₓ = √[2gL(1 − cos θ₀)]</span>
      <p>For small oscillations, the period depends on string length and gravity, not bob mass. The animation uses the small-angle motion approximation; the energy-based maximum speed is shown for comparison.</p>
    </div>
  </div>
}
