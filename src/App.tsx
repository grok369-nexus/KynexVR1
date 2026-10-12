import { useMemo, useState } from 'react'
import PulleyWorkshop from './PulleyWorkshop'
import TableHangingMassLab from './TableHangingMassLab'
import { solveAtwood, solveCircularMotion, solveCoulombForce } from './physics/engine'
import ProjectileLab from './ProjectileLab'
import InclinedPlaneLab from './InclinedPlaneLab'
import PendulumLab from './PendulumLab'

type Page = 'welcome' | 'dashboard' | 'topic'
type TopicId = 'mechanics' | 'electrostatics' | 'circular'
type ExperimentId = 'atwood' | 'table-hanging' | 'projectile' | 'freefall' | 'inclined' | 'pendulum' | 'coulomb' | 'fields' | 'potential' | 'centripetal' | 'period' | 'orbit'

const topics: { id: TopicId; number: string; title: string; subtitle: string; icon: string; count: string; color: string; experiments: { id: ExperimentId; title: string; detail: string }[] }[] = [
  { id: 'mechanics', number: '01', title: 'Mechanics', subtitle: 'Motion, forces & energy', icon: '↗', count: '6 investigations', color: 'mint', experiments: [
    { id: 'atwood', title: 'Pulley system', detail: 'Investigate acceleration and tension as masses change.' },
    { id: 'table-hanging', title: 'Block + hanging mass', detail: 'Explore connected motion, acceleration and string tension.' },
    { id: 'projectile', title: 'Projectile motion', detail: 'Explore range, flight time and launch angle.' },
    { id: 'inclined', title: 'Inclined plane', detail: 'Resolve forces, friction and acceleration on a slope.' },
    { id: 'pendulum', title: 'Simple pendulum', detail: 'Investigate period, frequency and string length.' },
    { id: 'freefall', title: 'Free fall', detail: 'See how gravity changes velocity and displacement.' },
  ]},
  { id: 'electrostatics', number: '02', title: 'Electrostatics', subtitle: 'Charges, fields & potential', icon: '✳', count: '3 investigations', color: 'violet', experiments: [
    { id: 'coulomb', title: 'Coulomb’s law', detail: 'Change charge and separation to measure electric force.' },
    { id: 'fields', title: 'Electric field patterns', detail: 'Explore the field around positive and negative charges.' },
    { id: 'potential', title: 'Electric potential', detail: 'Compare potential as distance from a charge changes.' },
  ]},
  { id: 'circular', number: '03', title: 'Circular motion', subtitle: 'Rotation & centripetal force', icon: '⟳', count: '3 investigations', color: 'amber', experiments: [
    { id: 'centripetal', title: 'Centripetal force', detail: 'Test how speed, mass and radius affect inward force.' },
    { id: 'period', title: 'Period & frequency', detail: 'Connect rotation time, frequency and angular speed.' },
    { id: 'orbit', title: 'Circular orbits', detail: 'Explore the balance between speed, radius and gravity.' },
  ]},
]

function App() {
  const [page, setPage] = useState<Page>('welcome')
  const [searchQuery, setSearchQuery] = useState('')
  const [topicId, setTopicId] = useState<TopicId>('mechanics')
  const [experiment, setExperiment] = useState<ExperimentId>('atwood')
  const [massA, setMassA] = useState(2)
  const [massB, setMassB] = useState(4)
  const [chargeA, setChargeA] = useState(3)
  const [chargeB, setChargeB] = useState(-2)
  const [distance, setDistance] = useState(0.5)
  const [speed, setSpeed] = useState(4)
  const [radius, setRadius] = useState(1.5)
  const [rotatingMass, setRotatingMass] = useState(0.5)
  const [height, setHeight] = useState(1.5)
  const [observations, setObservations] = useState<string[]>([])
  const [labSummary, setLabSummary] = useState('')
  const topic = topics.find(item => item.id === topicId) ?? topics[0]
  const currentExperiment = topic.experiments.find(item => item.id === experiment) ?? topic.experiments[0]

  const atwoodModel = useMemo(() => solveAtwood(massA, massB), [massA, massB])
  const acceleration = atwoodModel.acceleration
  const tension = atwoodModel.tension
  const coulombModel = useMemo(() => solveCoulombForce(chargeA, chargeB, distance), [chargeA, chargeB, distance])
  const coulombForce = coulombModel.magnitude
  const circularModel = solveCircularMotion(rotatingMass, speed, radius)
  const centripetalAcceleration = circularModel.acceleration
  const centripetalForce = circularModel.centripetalForce
  const matchingExperiments = topics.flatMap(item => item.experiments.map(exp => ({ ...exp, topicId: item.id, topicTitle: item.title, topicColor: item.color, topicNumber: item.number }))).filter(item => {
    const query = searchQuery.trim().toLowerCase()
    return !query || [item.title, item.detail, item.topicTitle].some(value => value.toLowerCase().includes(query))
  })
  const openTopic = (id: TopicId, requestedExperiment?: ExperimentId) => {
    const selected = topics.find(item => item.id === id) ?? topics[0]
    setTopicId(id)
    setExperiment(requestedExperiment ?? selected.experiments[0].id)
    setPage('topic')
  }
  const openSearchResult = (id: TopicId, experimentId: ExperimentId) => {
    openTopic(id, experimentId)
    setSearchQuery('')
  }
  const addObservation = () => {
    const value = topicId === 'mechanics'
      ? experiment === 'atwood' ? `Pulley: a = ${acceleration.toFixed(2)} m/s², T = ${tension.toFixed(2)} N (m₁=${massA} kg, m₂=${massB} kg).`
        : experiment === 'table-hanging' ? (labSummary || 'Change the masses to calculate the connected system.')
        : experiment === 'projectile' || experiment === 'inclined' || experiment === 'pendulum' ? (labSummary || `${currentExperiment.title}: change a control to calculate the result.`)
        : `Free fall from ${height.toFixed(1)} m: ideal fall time ≈ ${Math.sqrt(2 * height / 9.81).toFixed(2)} s.`
      : topicId === 'electrostatics'
        ? experiment === 'coulomb' ? `Coulomb: force ≈ ${coulombForce.toFixed(3)} N; charges are ${coulombModel.type} at ${distance.toFixed(2)} m.` : `Field exploration: q₁ = ${chargeA} μC, q₂ = ${chargeB} μC, separation = ${distance.toFixed(2)} m.`
        : `Circular motion: aᶜ = ${centripetalAcceleration.toFixed(2)} m/s², Fᶜ = ${centripetalForce.toFixed(2)} N at v=${speed} m/s, r=${radius} m.`
    setObservations(prev => [value, ...prev].slice(0, 8))
  }

  return <div className="pl-app">
    <header className="pl-topbar">
      <button className="pl-brand" onClick={() => setPage('welcome')} aria-label="PhysicsLab UG home"><span className="pl-brand-mark">P<span>+</span></span><span><strong>PhysicsLab <i>UG</i></strong><small>LEARN BY EXPERIMENTING</small></span></button>
      {page !== 'welcome' && <nav className="pl-nav"><button className={page === 'dashboard' ? 'selected' : ''} onClick={() => setPage('dashboard')}>Dashboard</button><button className={page === 'topic' ? 'selected' : ''} onClick={() => setPage('topic')}>Virtual lab</button></nav>}
      <span className="pl-free"><span /> FREE FOR EVERY LEARNER</span>
    </header>

    {page === 'welcome' && <main className="pl-welcome">
      <section className="pl-welcome-copy">
        <div className="pl-eyebrow"><span>✳</span> PHYSICS ENGINE / ACCESS GRANTED</div>
        <h1>The universe<br />has rules. <em>Test them.</em></h1>
        <p>A living digital laboratory for minds that ask “what happens if…?” Change initial conditions, expose forces and fields, inspect the mathematics, and test your predictions. Built for UACE — designed to go beyond the syllabus.</p>
        <button className="pl-primary" onClick={() => setPage('dashboard')}>Enter the research lab <span>↗</span></button>
        <div className="pl-trust"><span>✓</span> Free to use <span>·</span> Works on mobile <span>·</span> Learn at your pace</div>
      </section>
      <section className="pl-welcome-art" aria-label="Live-style physics visualisation">
        <div className="pl-art-meta"><span>PHYSICS ENGINE / 001</span><span>TRAJECTORY FIELD</span><i>● MODEL READY</i></div>
        <svg className="pl-trajectory-art" viewBox="0 0 620 430" role="img" aria-label="Glowing projectile path through a deep-space coordinate field">
          <defs>
            <pattern id="physics-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#26344d" strokeWidth="1"/></pattern>
            <radialGradient id="field-glow"><stop offset="0%" stopColor="#6a4dff" stopOpacity=".26"/><stop offset="100%" stopColor="#6a4dff" stopOpacity="0"/></radialGradient>
            <linearGradient id="trajectory-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#36e5ff" stopOpacity=".25"/><stop offset="100%" stopColor="#36e5ff" stopOpacity="0"/></linearGradient>
            <linearGradient id="trajectory-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8b76ff"/><stop offset="50%" stopColor="#36e5ff"/><stop offset="100%" stopColor="#ffb45f"/></linearGradient>
            <filter id="neon-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect width="620" height="430" fill="#080d18"/>
          <circle cx="430" cy="125" r="210" fill="url(#field-glow)"/>
          <rect x="24" y="24" width="572" height="356" fill="url(#physics-grid)"/>
          <g stroke="#33415d" strokeWidth="1" fill="none" opacity=".75"><circle cx="420" cy="195" r="42"/><circle cx="420" cy="195" r="78"/><circle cx="420" cy="195" r="116"/><path d="M420 42V350M267 195H573"/></g>
          <path d="M70 340 H560 M70 340 V55" stroke="#65748e" strokeWidth="1.5" fill="none"/>
          <path d="M550 332 L560 340 L550 348 M62 65 L70 55 L78 65" stroke="#65748e" strokeWidth="1.5" fill="none"/>
          <path d="M92 320 Q290 -80 510 320 L92 320Z" fill="url(#trajectory-fill)"/>
          <path d="M92 320 Q290 -80 510 320" stroke="#36e5ff" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".12" filter="url(#neon-glow)"/>
          <path d="M92 320 Q290 -80 510 320" stroke="url(#trajectory-line)" strokeWidth="3.5" strokeLinecap="round" fill="none" filter="url(#neon-glow)"/>
          <path d="M92 320 L170 220" stroke="#ffb45f" strokeWidth="2.5" strokeDasharray="5 6"/>
          <path d="M151 220 L170 220 L168 239" stroke="#ffb45f" strokeWidth="2" fill="none"/>
          <circle cx="92" cy="320" r="7" fill="#ffb45f" filter="url(#neon-glow)"/>
          <circle cx="290" cy="120" r="7" fill="#36e5ff" filter="url(#neon-glow)"/>
          <circle cx="510" cy="320" r="7" fill="#ffb45f" filter="url(#neon-glow)"/>
          <path d="M290 120 V340 M92 320 H290" stroke="#536480" strokeWidth="1.3" strokeDasharray="4 6"/>
          <g fill="#9aabc7" fontFamily="monospace" fontSize="12"><text x="80" y="365">0</text><text x="280" y="365">x</text><text x="42" y="126">y</text><text x="304" y="108" fill="#36e5ff">APEX</text><text x="122" y="250" fill="#ffb45f">v₀</text><text x="404" y="286" fill="#36e5ff">RANGE →</text></g>
          <g transform="translate(366 48)"><rect width="190" height="72" rx="8" fill="#101a2b" stroke="#344968"/><circle cx="14" cy="18" r="3" fill="#36e5ff"/><text x="26" y="22" fontFamily="monospace" fontSize="9" fill="#8ea2c2">VERTICAL MOTION</text><text x="14" y="49" fontFamily="monospace" fontSize="17" fill="#36e5ff">vᵧ = uᵧ − gt</text><text x="14" y="63" fontFamily="monospace" fontSize="8" fill="#7186a8">IDEAL MODEL / SI UNITS</text></g>
          <g transform="translate(35 42)" fill="#7488aa" fontFamily="monospace" fontSize="8"><text x="0" y="0">SIMULATION 001</text><text x="0" y="14" fill="#36e5ff">● COMPUTATIONAL FIELD</text></g>
        </svg>
        <div className="pl-art-caption"><span className="pl-live-dot" /> CHANGE THE CONDITIONS. WATCH THE MODEL RESPOND.</div>
      </section>
      <section className="pl-welcome-bottom"><div><strong>03</strong><span>Core physics domains</span></div><div><strong>12</strong><span>Experiment pathways</span></div><div><strong>∞</strong><span>Hypotheses to test</span></div><span className="pl-bottom-note">MADE FOR CURIOUS MINDS</span></section>
    </main>}

    {page === 'dashboard' && <main className="pl-dashboard">
      <div className="pl-page-heading"><div><div className="pl-eyebrow"><span className="pl-live-dot" /> RESEARCH CONSOLE / UACE PHYSICS</div><h1>Enter the <em>unknown.</em></h1><p>Choose a system. Set its initial conditions. Let the laws of physics reveal what happens next.</p></div><div className="pl-status-card"><span className="pl-status-icon">⌁</span><div><strong>Simulation core online</strong><small>Deterministic models · SI units</small></div><span className="pl-status-pulse" /></div></div>
      <section className="pl-command-search" aria-label="Find an experiment"><span className="pl-search-icon">⌕</span><input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Find a system… try projectile, charge, pendulum" aria-label="Search physics experiments" /><kbd>SEARCH LAB</kbd></section>
      {searchQuery.trim() && <section className="pl-search-results"><div className="pl-search-results-head"><span className="pl-eyebrow">MATCHING SYSTEMS</span><span>{matchingExperiments.length} results</span></div>{matchingExperiments.length ? matchingExperiments.map(item => <button className="pl-search-result" key={item.id} onClick={() => openSearchResult(item.topicId, item.id)}><span className={`pl-result-topic-icon ${item.topicColor}`}>{item.topicId === 'mechanics' ? '↗' : item.topicId === 'electrostatics' ? '✳' : '⟳'}</span><span><strong>{item.title}</strong><small>{item.topicTitle} / {item.detail}</small></span><span className="pl-experiment-arrow">↗</span></button>) : <p className="pl-no-results">No matching system yet. Try another term, or explore the available topic areas below.</p>}</section>}
      <section className="pl-progress-strip"><div className="pl-progress-symbol">◎</div><div className="pl-progress-copy"><strong>Field notebook</strong><span>Your observations stay in this session. Record measurements, compare outcomes, and build your own evidence.</span></div><div className="pl-progress-count"><strong>{observations.length}</strong><span>observations saved</span></div></section>
      <div className="pl-section-heading"><div><span className="pl-eyebrow">01 — SELECT A DOMAIN</span><h2>Choose your system</h2></div><span className="pl-section-hint">A-LEVEL PHYSICS · OPEN ACCESS</span></div>
      <section className="pl-topic-grid">{topics.map(item => <article className={`pl-topic-card ${item.color}`} key={item.id}>
        <div className="pl-topic-card-top"><span className="pl-topic-number">{item.number} / TOPIC</span><span className="pl-topic-icon">{item.icon}</span></div>
        <h3>{item.title}</h3><p>{item.subtitle}</p><div className="pl-topic-divider" /><div className="pl-topic-card-foot"><span>{item.count}</span><button onClick={() => openTopic(item.id)}>Explore topic <span>↗</span></button></div>
        <div className="pl-card-decoration" aria-hidden="true">{item.id === 'mechanics' ? '↗' : item.id === 'electrostatics' ? '⊕' : '⟳'}</div>
      </article>)}</section>
      <section className="pl-quick-start"><div><span className="pl-eyebrow">FIELD CHALLENGE / 001</span><h2>Can you predict the outcome?</h2><p>Start with the block and hanging mass. Predict the acceleration, run the model, then explain the difference between your prediction and the result.</p></div><button className="pl-secondary" onClick={() => openTopic('mechanics', 'table-hanging')}>Run the challenge <span>↗</span></button></section>
      <section className="pl-research-principles"><div><span className="pl-principle-index">A</span><div><strong>Inspectable physics</strong><p>See the equations and assumptions, not just an animation.</p></div></div><div><span className="pl-principle-index">B</span><div><strong>Evidence over guessing</strong><p>Change parameters, measure outcomes, and record observations.</p></div></div><div><span className="pl-principle-index">C</span><div><strong>Honest models</strong><p>Every simulation should state what it includes and what it ignores.</p></div></div></section>
    </main>}

    {page === 'topic' && <main className="pl-workspace">
      <div className="pl-breadcrumb"><button onClick={() => setPage('dashboard')}>Dashboard</button><span>/</span><span>{topic.title}</span></div>
      <div className="pl-workspace-heading"><div><div className="pl-eyebrow">TOPIC {topic.number}</div><h1>{topic.title}<span>.</span></h1><p>{topic.subtitle}. Adjust the controls and record what you discover.</p></div><button className="pl-secondary" onClick={() => setPage('dashboard')}>← All topics</button></div>
      <div className="pl-workspace-layout">
        <aside className="pl-experiment-list"><div className="pl-aside-heading"><strong>Investigations</strong><span>{topic.experiments.length} EXPERIMENTS</span></div>{topic.experiments.map((item, index) => <button key={item.id} className={experiment === item.id ? 'pl-experiment-link active' : 'pl-experiment-link'} onClick={() => { setExperiment(item.id); setLabSummary('') }}><span className="pl-experiment-index">0{index + 1}</span><span className="pl-experiment-info"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="pl-experiment-arrow">›</span></button>)}<div className="pl-aside-tip"><span>✦</span><div><strong>Think like a scientist</strong><p>Change one variable at a time. Predict first, then compare with your results.</p></div></div></aside>
        <section className="pl-lab-panel"><div className="pl-lab-panel-head"><div><span className="pl-live-dot" /> INTERACTIVE SIMULATION</div><button onClick={() => setObservations([])}>Clear observations</button></div>
          <div className="pl-sim-title"><div><span className="pl-eyebrow">{topic.title.toUpperCase()}</span><h2>{currentExperiment.title}</h2><p>{currentExperiment.detail}</p></div><span className={`pl-sim-icon ${topic.color}`}>{topic.icon}</span></div>
          {topicId === 'mechanics' && experiment === 'atwood' && <PulleyWorkshop />}
          {topicId === 'mechanics' && experiment === 'table-hanging' && <TableHangingMassLab onSummaryChange={setLabSummary} />}
          {topicId === 'mechanics' && experiment === 'projectile' && <ProjectileLab onSummaryChange={setLabSummary} />}
          {topicId === 'mechanics' && experiment === 'inclined' && <InclinedPlaneLab onSummaryChange={setLabSummary} />}
          {topicId === 'mechanics' && experiment === 'pendulum' && <PendulumLab onSummaryChange={setLabSummary} />}
          {topicId === 'mechanics' && experiment === 'freefall' && <div className="pl-sim-content"><div className="pl-visual-stage pl-simple-stage"><span className="pl-fall-ball">●</span><span className="pl-ground-line" /><span className="pl-height-label">{height.toFixed(1)} m</span></div><div className="pl-controls-grid"><label>Drop height <strong>{height.toFixed(1)} m</strong><input type="range" min="0.5" max="20" step="0.5" value={height} onChange={e => setHeight(Number(e.target.value))}/></label><div className="pl-reading-card"><span>Fall time (ideal)</span><strong>{Math.sqrt(2 * height / 9.81).toFixed(2)} s</strong></div></div><div className="pl-formula-note"><strong>Model</strong><span>h = ½gt²</span><small>Assumes the object starts from rest and air resistance is negligible.</small></div></div>}
          {topicId === 'electrostatics' && <div className="pl-sim-content"><div className="pl-charge-stage"><div className={`pl-charge charge-a ${chargeA >= 0 ? 'positive' : 'negative'}`}>{chargeA > 0 ? '+' : chargeA < 0 ? '−' : '0'}<small>{Math.abs(chargeA)} μC</small></div><div className="pl-field-lines">{Array.from({length:5},(_,i)=><i key={i} style={{transform:`rotate(${(i-2)*14}deg)`}} />)}</div><div className={`pl-charge charge-b ${chargeB >= 0 ? 'positive' : 'negative'}`}>{chargeB > 0 ? '+' : chargeB < 0 ? '−' : '0'}<small>{Math.abs(chargeB)} μC</small></div><span className="pl-distance-label">{distance.toFixed(2)} m apart</span></div><div className="pl-controls-grid"><label>Charge 1 <strong>{chargeA} μC</strong><input type="range" min="-8" max="8" step="1" value={chargeA} onChange={e => setChargeA(Number(e.target.value))}/></label><label>Charge 2 <strong>{chargeB} μC</strong><input type="range" min="-8" max="8" step="1" value={chargeB} onChange={e => setChargeB(Number(e.target.value))}/></label><label className="pl-wide-control">Separation <strong>{distance.toFixed(2)} m</strong><input type="range" min="0.2" max="2" step="0.1" value={distance} onChange={e => setDistance(Number(e.target.value))}/></label></div><div className="pl-results-grid"><div><span>Force magnitude</span><strong>{coulombForce.toFixed(3)} <small>N</small></strong></div><div><span>Interaction</span><strong>{chargeA === 0 || chargeB === 0 ? 'No force' : chargeA * chargeB < 0 ? 'Attraction' : 'Repulsion'}</strong></div><div><span>Charge product</span><strong>{chargeA === 0 || chargeB === 0 ? 'Zero' : chargeA * chargeB > 0 ? 'Positive' : 'Negative'}</strong></div></div><div className="pl-formula-note"><strong>Coulomb's law</strong><span>F = k |q₁q₂| / r²</span><small>Charges are in μC; k ≈ 8.99 × 10⁹ N m²/C². The display is a simplified illustration.</small></div>{experiment !== 'coulomb' && <p className="pl-context-note">{experiment === 'fields' ? 'Compare the signs of the charges: field direction and shape depend on the charge arrangement.' : 'Electric potential from a point charge varies with charge and distance: V = kQ/r.'}</p>}</div>}
          {topicId === 'circular' && <div className="pl-sim-content"><div className="pl-visual-stage pl-circle-stage"><svg viewBox="0 0 500 230" role="img" aria-label="Object moving in a circular path"><circle cx="240" cy="112" r={Math.min(76, 32 + radius * 15)} fill="none" stroke="#506b7b" strokeWidth="2" strokeDasharray="7 7"/><line x1="240" y1="112" x2={240 + Math.min(76,32 + radius * 15)} y2="112" stroke="#f1bd69" strokeWidth="2"/><circle cx="240" cy="112" r="7" fill="#d9e8ed"/><circle cx={240 + Math.min(76,32 + radius * 15)} cy="112" r="13" fill="#f1bd69"/><path d={`M${240 + Math.min(76,32 + radius * 15)} 112 l-20 -8 m20 8 l-9 18`} stroke="#68dfbd" strokeWidth="3" fill="none" strokeLinecap="round"/><text x="240" y="218" textAnchor="middle" fill="#b9cbd3" fontSize="12">Inward acceleration points to the centre</text></svg></div><div className="pl-controls-grid"><label>Speed <strong>{speed.toFixed(1)} m/s</strong><input type="range" min="0.5" max="12" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))}/></label><label>Radius <strong>{radius.toFixed(1)} m</strong><input type="range" min="0.5" max="5" step="0.5" value={radius} onChange={e => setRadius(Number(e.target.value))}/></label><label className="pl-wide-control">Rotating mass <strong>{rotatingMass.toFixed(1)} kg</strong><input type="range" min="0.1" max="5" step="0.1" value={rotatingMass} onChange={e => setRotatingMass(Number(e.target.value))}/></label></div><div className="pl-results-grid"><div><span>Centripetal acceleration</span><strong>{centripetalAcceleration.toFixed(2)} <small>m/s²</small></strong></div><div><span>Centripetal force</span><strong>{centripetalForce.toFixed(2)} <small>N</small></strong></div><div><span>Angular speed</span><strong>{(speed / radius).toFixed(2)} <small>rad/s</small></strong></div></div><div className="pl-formula-note"><strong>Circular motion</strong><span>a = v²/r · F = mv²/r</span><small>Try doubling the speed. Notice how much more rapidly the required inward force increases.</small></div>{experiment === 'period' && <p className="pl-context-note">Period T = 2πr/v = {(2 * Math.PI * radius / speed).toFixed(2)} s; frequency f = {(speed / (2 * Math.PI * radius)).toFixed(2)} Hz.</p>}{experiment === 'orbit' && <p className="pl-context-note">For a stable circular orbit, gravity supplies the centripetal force. This model illustrates the circular-motion relationship, not a full orbital gravity solver.</p>}</div>}
          <div className="pl-observation-action"><div><strong>Record your result</strong><span>Save the current readings to your observation notebook.</span></div><button className="pl-primary pl-record-btn" onClick={addObservation}>＋ Record observation</button></div>
          {observations.length > 0 && <section className="pl-notebook"><div className="pl-notebook-head"><div><span className="pl-eyebrow">YOUR LAB NOTEBOOK</span><h3>Saved observations</h3></div><span>{observations.length} saved</span></div>{observations.map((item,i)=><div className="pl-observation" key={i}><span>0{i+1}</span><p>{item}</p></div>)}</section>}
        </section>
      </div>
      <footer className="pl-workspace-footer">PHYSICSLAB UG <span>•</span> Explore. Measure. Understand.</footer>
    </main>}
    <footer className="pl-footer"><span>© PhysicsLab UG</span><span>Made for curious minds in Uganda <i>✳</i></span></footer>
  </div>
}

export default App
