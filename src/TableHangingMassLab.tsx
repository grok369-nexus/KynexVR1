import { useEffect, useMemo, useState } from 'react'
import { solveTableHangingMass } from './physics/engine'

const MAX_TIME = 1.2

type Props = { onSummaryChange?: (summary: string) => void }

export default function TableHangingMassLab({ onSummaryChange }: Props) {
  const [tableMass, setTableMass] = useState(3)
  const [hangingMass, setHangingMass] = useState(2)
  const [gravity, setGravity] = useState(9.81)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  const model = useMemo(
    () => solveTableHangingMass(tableMass, hangingMass, gravity),
    [tableMass, hangingMass, gravity],
  )
  const displacement = 0.5 * model.acceleration * time * time
  const speed = model.acceleration * time
  const pixels = Math.min(90, displacement * 95)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setTime(current => Math.min(MAX_TIME, current + 0.025))
    }, 25)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (time >= MAX_TIME) setRunning(false)
  }, [time])

  useEffect(() => {
    onSummaryChange?.(
      `Block + hanging mass: a = ${model.acceleration.toFixed(2)} m/s², T = ${model.tension.toFixed(2)} N; m₁ = ${tableMass} kg, m₂ = ${hangingMass} kg, g = ${gravity.toFixed(2)} m/s².`,
    )
  }, [model, tableMass, hangingMass, gravity, onSummaryChange])

  const reset = () => {
    setRunning(false)
    setTime(0)
  }

  return <div className="ph-lab">
    <div className="ph-sim-canvas">
      <div className="ph-canvas-label"><span className="ph-live-dot" /> IDEAL CONNECTED-MASS MODEL · SI UNITS</div>
      <svg viewBox="0 0 640 275" role="img" aria-label="Block on a horizontal table connected over a pulley to a hanging mass">
        <defs>
          <pattern id="table-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#193342" strokeWidth="1" /></pattern>
          <marker id="arrow-mint" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#72e4c4" /></marker>
          <marker id="arrow-orange" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#f1bd69" /></marker>
        </defs>
        <rect x="0" y="0" width="640" height="275" fill="url(#table-grid)" />
        <rect x="34" y="148" width="455" height="14" rx="3" fill="#284958" />
        <path d="M34 148H489" stroke="#668c99" strokeWidth="2" />
        <path d="M65 162L48 245M445 162L462 245M48 245H462" stroke="#284958" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M462 130V24H540V37" stroke="#4a6b79" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${100 + pixels} 128H460A17 17 0 0 1 477 145V${160 + pixels}`} stroke="#d7e8e9" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="460" cy="128" r="19" fill="#16313e" stroke="#8baab5" strokeWidth="3" />
        <circle cx="460" cy="128" r="5" fill="#d5e7e9" />
        <rect x={30 + pixels} y="105" width="70" height="42" rx="7" fill="#23594f" stroke="#72e4c4" strokeWidth="2" />
        <text x={65 + pixels} y="122" textAnchor="middle" fill="#d9fff2" fontSize="10">BLOCK</text>
        <text x={65 + pixels} y="137" textAnchor="middle" fill="#72e4c4" fontSize="12" fontWeight="700">{tableMass} kg</text>
        <rect x="442" y={160 + pixels} width="36" height="42" rx="5" fill="#694b2d" stroke="#f1bd69" strokeWidth="2" />
        <text x="460" y={177 + pixels} textAnchor="middle" fill="#fff0d4" fontSize="9">MASS</text>
        <text x="460" y={192 + pixels} textAnchor="middle" fill="#f1bd69" fontSize="11" fontWeight="700">{hangingMass} kg</text>
        <path d={`M${110 + pixels} 124H${155 + pixels}`} stroke="#72e4c4" strokeWidth="3" markerEnd="url(#arrow-mint)" />
        <path d={`M498 ${178 + pixels}V${207 + pixels}`} stroke="#f1bd69" strokeWidth="3" markerEnd="url(#arrow-orange)" />
        <text x="124" y="37" fill="#8baab5" fontSize="11">String tension, T</text>
        <path d="M135 43L180 87" stroke="#648391" strokeWidth="1.2" strokeDasharray="3 4" />
        <text x="500" y="80" fill="#8baab5" fontSize="11">Ideal pulley</text>
        <text x="34" y="265" fill="#8baab5" fontSize="10">t = {time.toFixed(2)} s</text>
        <text x="606" y="265" textAnchor="end" fill="#8baab5" fontSize="10">s = {displacement.toFixed(3)} m</text>
      </svg>
      <div className="ph-playback">
        <button className="ph-action-button" onClick={() => { if (time >= MAX_TIME) setTime(0); setRunning(value => !value) }}>{running ? 'Pause motion' : time >= MAX_TIME ? 'Run again' : '▶ Run motion'}</button>
        <button className="ph-action-button secondary" onClick={reset}>Reset</button>
        <label className="ph-time-control"><span>Time</span><input aria-label="Simulation time" type="range" min="0" max={MAX_TIME} step="0.01" value={time} onChange={event => { setRunning(false); setTime(Number(event.target.value)) }} /><strong>{time.toFixed(2)} s</strong></label>
      </div>
    </div>

    <div className="ph-controls">
      <label>Block on table, m₁ <strong>{tableMass.toFixed(1)} kg</strong><input type="range" min="0.5" max="10" step="0.5" value={tableMass} onChange={event => { setTableMass(Number(event.target.value)); reset() }} /></label>
      <label>Hanging mass, m₂ <strong>{hangingMass.toFixed(1)} kg</strong><input type="range" min="0.5" max="10" step="0.5" value={hangingMass} onChange={event => { setHangingMass(Number(event.target.value)); reset() }} /></label>
      <label>Gravitational field strength, g <strong>{gravity.toFixed(2)} m/s²</strong><input type="range" min="1.6" max="15" step="0.01" value={gravity} onChange={event => { setGravity(Number(event.target.value)); reset() }} /></label>
      <div className="ph-explanation"><strong>Try this investigation</strong><p>Predict what happens when the hanging mass increases. Run the motion, then compare the acceleration and tension. Change one variable at a time.</p></div>
    </div>

    <div className="ph-readouts">
      <div><span>Acceleration, a</span><strong>{model.acceleration.toFixed(2)} <small>m/s²</small></strong></div>
      <div><span>String tension, T</span><strong>{model.tension.toFixed(2)} <small>N</small></strong></div>
      <div><span>Speed at current time</span><strong>{speed.toFixed(2)} <small>m/s</small></strong></div>
      <div><span>Distance moved</span><strong>{displacement.toFixed(3)} <small>m</small></strong></div>
    </div>

    <div className="ph-explanation">
      <strong>Physics behind the motion</strong>
      <span>a = m₂g / (m₁ + m₂) = {model.acceleration.toFixed(3)} m/s²</span>
      <span>T = m₁a = {model.tension.toFixed(3)} N</span>
      <p>Assumptions: a frictionless table, massless inextensible string, frictionless massless pulley, and negligible air resistance. The animation is a visual model; the displayed values come from the analytic equations.</p>
    </div>
  </div>
}
