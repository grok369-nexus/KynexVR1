import { useMemo, useState } from 'react'

export default function InclinedPlaneLab() {
  const [mass, setMass] = useState(5)
  const [angle, setAngle] = useState(30)
  const [muStatic, setMuStatic] = useState(0.5)
  const [muKinetic, setMuKinetic] = useState(0.25)
  const [gravity, setGravity] = useState(9.81)

  const result = useMemo(() => {
    const radians = angle * Math.PI / 180
    const weight = mass * gravity
    const parallel = weight * Math.sin(radians)
    const normal = weight * Math.cos(radians)
    const maximumStatic = muStatic * normal
    const staysAtRest = parallel <= maximumStatic
    const friction = staysAtRest ? parallel : muKinetic * normal
    const netDownSlope = staysAtRest ? 0 : parallel - friction
    return {
      weight, parallel, normal, friction, netDownSlope,
      acceleration: netDownSlope / mass,
      staysAtRest,
      maximumStatic,
    }
  }, [mass, angle, muStatic, muKinetic, gravity])

  const radians = angle * Math.PI / 180
  const blockX = 45 + 165 * Math.cos(radians)
  const blockY = 235 - 165 * Math.sin(radians)
  const forceScale = 2.25
  const arrow = (x: number, y: number, dx: number, dy: number, color: string, label: string, key: string) =>
    <g key={key}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M ${x + dx} ${y + dy} l ${-dx * 0.18 - dy * 0.12} ${-dy * 0.18 + dx * 0.12} l ${dy * 0.24} ${-dx * 0.24} Z`} fill={color} />
      <text x={x + dx * 1.08} y={y + dy * 1.08} fill={color} fontSize="11" fontWeight="600">{label}</text>
    </g>

  return <div className="ph-lab">
    <div className="ph-sim-canvas">
      <div className="ph-canvas-label"><span className="ph-live-dot" /> BLOCK ON A ROUGH INCLINED PLANE</div>
      <svg viewBox="0 0 580 300" role="img" aria-label="Block on a sloped plane showing weight, normal reaction and friction">
        <defs><pattern id="ph-ramp-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#203b47" strokeWidth="1" /></pattern></defs>
        <rect x="0" y="0" width="580" height="300" fill="url(#ph-ramp-grid)" />
        <path d={`M 35 252 L ${35 + 310 * Math.cos(radians)} ${252 - 310 * Math.sin(radians)} L ${35 + 310 * Math.cos(radians)} 252 Z`} fill="#183440" stroke="#527582" strokeWidth="2" />
        <line x1="35" y1="252" x2="550" y2="252" stroke="#6b8792" strokeWidth="2" />
        <g transform={`translate(${blockX} ${blockY}) rotate(${-angle})`}>
          <rect x="-22" y="-22" width="44" height="44" rx="5" fill="#72e4c4" stroke="#d8fff4" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#0a2028" fontSize="12" fontWeight="700">{mass}kg</text>
        </g>
        {arrow(blockX, blockY, 0, result.weight * forceScale, '#f1bd69', 'mg', 'weight')}
        {arrow(blockX, blockY, -Math.sin(radians) * result.normal * forceScale, -Math.cos(radians) * result.normal * forceScale, '#7db7ff', 'N', 'normal')}
        {arrow(blockX, blockY, Math.cos(radians) * result.friction * forceScale, -Math.sin(radians) * result.friction * forceScale, '#f39caa', 'Friction', 'friction')}
        <path d={`M 82 252 A 47 47 0 0 0 ${82 + 47 * Math.cos(radians)} ${252 - 47 * Math.sin(radians)}`} fill="none" stroke="#f1bd69" strokeWidth="2" />
        <text x="89" y="236" fill="#f1bd69" fontSize="12">{angle}°</text>
        <text x="25" y="28" fill="#a6c0c9" fontSize="11">Force diagram · not to scale</text>
      </svg>
    </div>
    <div className="ph-controls">
      <label>Block mass <strong>{mass.toFixed(1)} kg</strong><input type="range" min="1" max="20" step="0.5" value={mass} onChange={e => setMass(Number(e.target.value))} /></label>
      <label>Slope angle <strong>{angle}°</strong><input type="range" min="5" max="60" step="1" value={angle} onChange={e => setAngle(Number(e.target.value))} /></label>
      <label>Static friction μₛ <strong>{muStatic.toFixed(2)}</strong><input type="range" min="0" max="1" step="0.05" value={muStatic} onChange={e => setMuStatic(Number(e.target.value))} /></label>
      <label>Kinetic friction μₖ <strong>{muKinetic.toFixed(2)}</strong><input type="range" min="0" max="0.8" step="0.05" value={muKinetic} onChange={e => setMuKinetic(Number(e.target.value))} /></label>
      <label>Gravity g <strong>{gravity.toFixed(2)} m/s²</strong><input type="range" min="1" max="15" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} /></label>
    </div>
    <div className="ph-state-note"><strong>{result.staysAtRest ? 'Static equilibrium' : 'Block slides down the plane'}</strong><p>{result.staysAtRest ? 'Static friction is sufficient to balance the component of weight down the slope.' : 'Kinetic friction acts up the slope while the block moves down. The net force determines its acceleration.'}</p></div>
    <div className="ph-readouts">
      <div><span>Weight mg</span><strong>{result.weight.toFixed(2)} <small>N</small></strong></div>
      <div><span>Normal reaction</span><strong>{result.normal.toFixed(2)} <small>N</small></strong></div>
      <div><span>Friction</span><strong>{result.friction.toFixed(2)} <small>N</small></strong></div>
      <div><span>Acceleration</span><strong>{result.acceleration.toFixed(2)} <small>m/s²</small></strong></div>
    </div>
    <div className="ph-explanation">
      <strong>How the result is calculated</strong>
      <span>Weight down slope = mg sin θ</span>
      <span>Normal reaction = mg cos θ</span>
      <span>Moving: a = g(sin θ − μₖ cos θ)</span>
      <p>This model checks whether static friction can hold the block. If it cannot, the block slides and kinetic friction is used. Air resistance and external pushes are ignored.</p>
    </div>
  </div>
}
