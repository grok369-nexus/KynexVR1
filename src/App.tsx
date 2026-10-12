import { useMemo, useState } from 'react'

type Page = 'welcome' | 'dashboard' | 'topic'
type TopicId = 'mechanics' | 'electrostatics' | 'circular'
type ExperimentId = 'atwood' | 'projectile' | 'freefall' | 'coulomb' | 'fields' | 'potential' | 'centripetal' | 'period' | 'orbit'

const topics: { id: TopicId; number: string; title: string; subtitle: string; icon: string; count: string; color: string; experiments: { id: ExperimentId; title: string; detail: string }[] }[] = [
  { id: 'mechanics', number: '01', title: 'Mechanics', subtitle: 'Motion, forces & energy', icon: '↗', count: '4 investigations', color: 'mint', experiments: [
    { id: 'atwood', title: 'Pulley system', detail: 'Investigate acceleration and tension as masses change.' },
    { id: 'projectile', title: 'Projectile motion', detail: 'Explore range, flight time and launch angle.' },
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
  const [angle, setAngle] = useState(45)
  const [height, setHeight] = useState(1.5)
  const [launchSpeed, setLaunchSpeed] = useState(12)
  const [observations, setObservations] = useState<string[]>([])
  const topic = topics.find(item => item.id === topicId) ?? topics[0]
  const currentExperiment = topic.experiments.find(item => item.id === experiment) ?? topic.experiments[0]

  const acceleration = useMemo(() => ((massB - massA) * 9.81) / (massA + massB), [massA, massB])
  const tension = useMemo(() => (2 * massA * massB * 9.81) / (massA + massB), [massA, massB])
  const coulombForce = useMemo(() => 8.99e9 * Math.abs(chargeA * 1e-6 * chargeB * 1e-6) / (distance * distance), [chargeA, chargeB, distance])
  const centripetalAcceleration = speed * speed / radius
  const centripetalForce = rotatingMass * centripetalAcceleration
  const flightTime = (2 * launchSpeed * Math.sin(angle * Math.PI / 180)) / 9.81
  const projectileRange = (launchSpeed * launchSpeed * Math.sin(2 * angle * Math.PI / 180)) / 9.81
  const openTopic = (id: TopicId) => {
    const selected = topics.find(item => item.id === id) ?? topics[0]
    setTopicId(id)
    setExperiment(selected.experiments[0].id)
    setPage('topic')
  }
  const addObservation = () => {
    const value = topicId === 'mechanics'
      ? experiment === 'atwood' ? `Pulley: a = ${acceleration.toFixed(2)} m/s², T = ${tension.toFixed(2)} N (m₁=${massA} kg, m₂=${massB} kg).` : experiment === 'projectile' ? `Projectile: range ≈ ${projectileRange.toFixed(2)} m, flight time ≈ ${flightTime.toFixed(2)} s at ${angle}°.` : `Free fall from ${height.toFixed(1)} m: ideal fall time ≈ ${Math.sqrt(2 * height / 9.81).toFixed(2)} s.`
      : topicId === 'electrostatics'
        ? experiment === 'coulomb' ? `Coulomb: force ≈ ${coulombForce.toFixed(3)} N; charges are ${chargeA * chargeB < 0 ? 'attractive' : 'repulsive'} at ${distance.toFixed(2)} m.` : `Field exploration: q₁ = ${chargeA} μC, q₂ = ${chargeB} μC, separation = ${distance.toFixed(2)} m.`
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
        <div className="pl-eyebrow"><span>✳</span> YOUR VIRTUAL PHYSICS LABORATORY</div>
        <h1>Don't just learn<br />Physics. <em>Explore it.</em></h1>
        <p>Change the variables. Run the experiment. See what happens. A hands-on A-level Physics space, built for learners everywhere — including right here in Uganda.</p>
        <button className="pl-primary" onClick={() => setPage('dashboard')}>Enter Virtual Lab <span>↗</span></button>
        <div className="pl-trust"><span>✓</span> Free to use <span>·</span> Works on mobile <span>·</span> Learn at your pace</div>
      </section>
      <section className="pl-welcome-art" aria-label="Physics laboratory illustration">
        <div className="pl-art-orbit orbit-a" /><div className="pl-art-orbit orbit-b" />
        <div className="pl-art-chip chip-one">F = ma</div><div className="pl-art-chip chip-two">E = kQ/r²</div>
        <div className="pl-art-center"><div className="pl-orbit-ring ring-one" /><div className="pl-orbit-ring ring-two" /><div className="pl-atom-core">P<span>+</span></div><i className="pl-electron electron-one" /><i className="pl-electron electron-two" /></div>
        <div className="pl-art-caption"><span className="pl-live-dot" /> EXPERIMENTS THAT RESPOND TO YOU</div>
      </section>
      <section className="pl-welcome-bottom"><div><strong>03</strong><span>Core topic areas</span></div><div><strong>10+</strong><span>Investigations to explore</span></div><div><strong>∞</strong><span>Ways to experiment</span></div><span className="pl-bottom-note">MADE FOR CURIOUS MINDS</span></section>
    </main>}

    {page === 'dashboard' && <main className="pl-dashboard">
      <div className="pl-page-heading"><div><div className="pl-eyebrow">YOUR LEARNING SPACE</div><h1>Welcome to the lab<span>.</span></h1><p>Pick a topic, choose an experiment, and discover the physics for yourself.</p></div><div className="pl-status-card"><span className="pl-status-icon">✳</span><div><strong>Your lab is ready</strong><small>Choose any experiment to begin</small></div></div></div>
      <section className="pl-progress-strip"><div className="pl-progress-symbol">◎</div><div className="pl-progress-copy"><strong>Your exploration journey</strong><span>Start with any topic — your observations will be collected as you go.</span></div><div className="pl-progress-count"><strong>{observations.length}</strong><span>observations saved</span></div></section>
      <div className="pl-section-heading"><div><span className="pl-eyebrow">THE LABORATORY</span><h2>Explore a topic</h2></div><span className="pl-section-hint">3 TOPICS · A-LEVEL PHYSICS</span></div>
      <section className="pl-topic-grid">{topics.map(item => <article className={`pl-topic-card ${item.color}`} key={item.id}>
        <div className="pl-topic-card-top"><span className="pl-topic-number">{item.number} / TOPIC</span><span className="pl-topic-icon">{item.icon}</span></div>
        <h3>{item.title}</h3><p>{item.subtitle}</p><div className="pl-topic-divider" /><div className="pl-topic-card-foot"><span>{item.count}</span><button onClick={() => openTopic(item.id)}>Explore topic <span>↗</span></button></div>
        <div className="pl-card-decoration" aria-hidden="true">{item.id === 'mechanics' ? '↗' : item.id === 'electrostatics' ? '⊕' : '⟳'}</div>
      </article>)}</section>
      <section className="pl-quick-start"><div><span className="pl-eyebrow">NOT SURE WHERE TO START?</span><h2>Start with a simple experiment.</h2><p>Try changing two hanging masses and watch how the acceleration changes.</p></div><button className="pl-secondary" onClick={() => openTopic('mechanics')}>Open mechanics <span>→</span></button></section>
    </main>}

    {page === 'topic' && <main className="pl-workspace">
      <div className="pl-breadcrumb"><button onClick={() => setPage('dashboard')}>Dashboard</button><span>/</span><span>{topic.title}</span></div>
      <div className="pl-workspace-heading"><div><div className="pl-eyebrow">TOPIC {topic.number}</div><h1>{topic.title}<span>.</span></h1><p>{topic.subtitle}. Adjust the controls and record what you discover.</p></div><button className="pl-secondary" onClick={() => setPage('dashboard')}>← All topics</button></div>
      <div className="pl-workspace-layout">
        <aside className="pl-experiment-list"><div className="pl-aside-heading"><strong>Investigations</strong><span>{topic.experiments.length} EXPERIMENTS</span></div>{topic.experiments.map((item, index) => <button key={item.id} className={experiment === item.id ? 'pl-experiment-link active' : 'pl-experiment-link'} onClick={() => setExperiment(item.id)}><span className="pl-experiment-index">0{index + 1}</span><span className="pl-experiment-info"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="pl-experiment-arrow">›</span></button>)}<div className="pl-aside-tip"><span>✦</span><div><strong>Think like a scientist</strong><p>Change one variable at a time. Predict first, then compare with your results.</p></div></div></aside>
        <section className="pl-lab-panel"><div className="pl-lab-panel-head"><div><span className="pl-live-dot" /> INTERACTIVE SIMULATION</div><button onClick={() => setObservations([])}>Clear observations</button></div>
          <div className="pl-sim-title"><div><span className="pl-eyebrow">{topic.title.toUpperCase()}</span><h2>{currentExperiment.title}</h2><p>{currentExperiment.detail}</p></div><span className={`pl-sim-icon ${topic.color}`}>{topic.icon}</span></div>
          {topicId === 'mechanics' && experiment === 'atwood' && <div className="pl-sim-content"><div className="pl-visual-stage"><svg viewBox="0 0 500 230" role="img" aria-label="Interactive Atwood pulley system"><path d="M90 30 H410" stroke="#526d7b" strokeWidth="8" strokeLinecap="round"/><circle cx="250" cy="45" r="30" fill="#1a3544" stroke="#89a6b4" strokeWidth="5"/><circle cx="250" cy="45" r="5" fill="#d8f4ef"/><path d="M220 45 V150 M280 45 V105" stroke="#8db2bd" strokeWidth="3"/><path d="M220 45 A30 30 0 0 1 280 45" fill="none" stroke="#8db2bd" strokeWidth="3"/><rect x="192" y="150" width="56" height={Math.min(48, massA * 9)} rx="7" fill="#68dfbd"/><rect x="252" y="105" width="56" height={Math.min(78, massB * 15)} rx="7" fill="#aa9aff"/><text x="220" y="177" fill="#07131f" textAnchor="middle" fontSize="14" fontWeight="700">m₁</text><text x="280" y="132" fill="#07131f" textAnchor="middle" fontSize="14" fontWeight="700">m₂</text><text x="220" y="210" fill="#b9cbd3" textAnchor="middle" fontSize="13">{massA} kg</text><text x="280" y="210" fill="#b9cbd3" textAnchor="middle" fontSize="13">{massB} kg</text><path d={massB >= massA ? "M340 90 V145 l-7 -10 M340 145 l7 -10" : "M340 145 V90 l-7 10 M340 90 l7 10"} stroke="#68dfbd" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/><text x="365" y="120" fill="#68dfbd" fontSize="12">{massB >= massA ? 'Moves down' : 'Moves up'}</text></svg></div><div className="pl-controls-grid"><label>Mass 1 <strong>{massA.toFixed(1)} kg</strong><input type="range" min="0.5" max="8" step="0.5" value={massA} onChange={e => setMassA(Number(e.target.value))}/></label><label>Mass 2 <strong>{massB.toFixed(1)} kg</strong><input type="range" min="0.5" max="8" step="0.5" value={massB} onChange={e => setMassB(Number(e.target.value))}/></label></div><div className="pl-results-grid"><div><span>Acceleration</span><strong>{acceleration.toFixed(2)} <small>m/s²</small></strong></div><div><span>String tension</span><strong>{tension.toFixed(2)} <small>N</small></strong></div><div><span>Direction</span><strong>{massA === massB ? 'Balanced' : massB > massA ? 'Mass 2 ↓' : 'Mass 1 ↓'}</strong></div></div><div className="pl-formula-note"><strong>Model</strong><span>a = (m₂ − m₁)g / (m₁ + m₂)</span><small>Assumes a light string, frictionless pulley and g = 9.81 m/s².</small></div></div>}
          {topicId === 'mechanics' && experiment === 'projectile' && <div className="pl-sim-content"><div className="pl-visual-stage"><svg viewBox="0 0 500 230" role="img" aria-label="Projectile trajectory"><path d="M30 190 H475" stroke="#526d7b" strokeWidth="2"/><path d={`M55 190 Q ${55 + projectileRange * 9} ${Math.max(30, 190 - Math.min(150, launchSpeed * Math.sin(angle * Math.PI / 180) * 7))} ${Math.min(465, 55 + projectileRange * 18)} 190`} stroke="#68dfbd" strokeWidth="3" fill="none" strokeDasharray="6 5"/><circle cx="55" cy="190" r="7" fill="#68dfbd"/><text x="32" y="215" fill="#b9cbd3" fontSize="12">Launch</text><text x="360" y="215" fill="#b9cbd3" fontSize="12">Horizontal range →</text></svg></div><div className="pl-controls-grid"><label>Launch speed <strong>{launchSpeed} m/s</strong><input type="range" min="4" max="25" step="1" value={launchSpeed} onChange={e => setLaunchSpeed(Number(e.target.value))}/></label><label>Launch angle <strong>{angle}°</strong><input type="range" min="10" max="80" step="5" value={angle} onChange={e => setAngle(Number(e.target.value))}/></label></div><div className="pl-results-grid"><div><span>Horizontal range</span><strong>{projectileRange.toFixed(2)} <small>m</small></strong></div><div><span>Flight time</span><strong>{flightTime.toFixed(2)} <small>s</small></strong></div><div><span>Initial speed</span><strong>{launchSpeed} <small>m/s</small></strong></div></div><div className="pl-formula-note"><strong>Model</strong><span>R = u² sin(2θ) / g</span><small>Ideal projectile launched and landing at the same height; air resistance ignored.</small></div></div>}
          {topicId === 'mechanics' && experiment === 'freefall' && <div className="pl-sim-content"><div className="pl-visual-stage pl-simple-stage"><span className="pl-fall-ball">●</span><span className="pl-ground-line" /><span className="pl-height-label">{height.toFixed(1)} m</span></div><div className="pl-controls-grid"><label>Drop height <strong>{height.toFixed(1)} m</strong><input type="range" min="0.5" max="20" step="0.5" value={height} onChange={e => setHeight(Number(e.target.value))}/></label><div className="pl-reading-card"><span>Fall time (ideal)</span><strong>{Math.sqrt(2 * height / 9.81).toFixed(2)} s</strong></div></div><div className="pl-formula-note"><strong>Model</strong><span>h = ½gt²</span><small>Assumes the object starts from rest and air resistance is negligible.</small></div></div>}
          {topicId === 'electrostatics' && <div className="pl-sim-content"><div className="pl-charge-stage"><div className={`pl-charge charge-a ${chargeA >= 0 ? 'positive' : 'negative'}`}>{chargeA > 0 ? '+' : '−'}<small>{Math.abs(chargeA)} μC</small></div><div className="pl-field-lines">{Array.from({length:5},(_,i)=><i key={i} style={{transform:`rotate(${(i-2)*14}deg)`}} />)}</div><div className={`pl-charge charge-b ${chargeB >= 0 ? 'positive' : 'negative'}`}>{chargeB > 0 ? '+' : '−'}<small>{Math.abs(chargeB)} μC</small></div><span className="pl-distance-label">{distance.toFixed(2)} m apart</span></div><div className="pl-controls-grid"><label>Charge 1 <strong>{chargeA} μC</strong><input type="range" min="-8" max="8" step="1" value={chargeA} onChange={e => setChargeA(Number(e.target.value) || 1)}/></label><label>Charge 2 <strong>{chargeB} μC</strong><input type="range" min="-8" max="8" step="1" value={chargeB} onChange={e => setChargeB(Number(e.target.value) || -1)}/></label><label className="pl-wide-control">Separation <strong>{distance.toFixed(2)} m</strong><input type="range" min="0.2" max="2" step="0.1" value={distance} onChange={e => setDistance(Number(e.target.value))}/></label></div><div className="pl-results-grid"><div><span>Force magnitude</span><strong>{coulombForce.toFixed(3)} <small>N</small></strong></div><div><span>Interaction</span><strong>{chargeA * chargeB < 0 ? 'Attraction' : 'Repulsion'}</strong></div><div><span>Charge product</span><strong>{chargeA * chargeB > 0 ? 'Positive' : 'Negative'}</strong></div></div><div className="pl-formula-note"><strong>Coulomb's law</strong><span>F = k |q₁q₂| / r²</span><small>Charges are in μC; k ≈ 8.99 × 10⁹ N m²/C². The display is a simplified illustration.</small></div>{experiment !== 'coulomb' && <p className="pl-context-note">{experiment === 'fields' ? 'Compare the signs of the charges: field direction and shape depend on the charge arrangement.' : 'Electric potential from a point charge varies with charge and distance: V = kQ/r.'}</p>}</div>}
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
