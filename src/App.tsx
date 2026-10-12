import { useMemo, useState } from 'react'

type Experiment = 'atwood' | 'projectile' | 'ohm'

function App() {
  const [experiment, setExperiment] = useState<Experiment>('atwood')
  const [massA, setMassA] = useState(2)
  const [massB, setMassB] = useState(4)
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [height, setHeight] = useState(1.5)

  const acceleration = useMemo(() => ((massB - massA) * 9.81) / (massA + massB), [massA, massB])
  const tension = useMemo(() => (2 * massA * massB * 9.81) / (massA + massB), [massA, massB])
  const displacement = Math.min(2.1, Math.max(0, 0.5 * Math.abs(acceleration) * time * time))
  const reset = () => { setRunning(false); setTime(0) }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setExperiment('atwood') }}>
          <span className="brand-mark">P<span>+</span></span>
          <span>PhysicsLab <b>UG</b><small>LEARN BY EXPERIMENTING</small></span>
        </a>
        <nav className="desktop-nav"><a className="active" href="#lab">Virtual lab</a><a href="#experiments">Experiments</a><a href="#about">About</a></nav>
        <span className="free-pill"><i /> 100% FREE</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span>✳</span> YOUR CLASSROOM, REIMAGINED</div>
            <h1>Big ideas.<br /><em>Real experiments.</em></h1>
            <p>Explore the laws of Physics by doing, not just reading. A free virtual laboratory made for A-level students in Uganda.</p>
            <a className="primary-btn" href="#lab">Enter the virtual lab <span>↗</span></a>
            <div className="hero-proof"><span className="proof-icon">✓</span> No lab equipment needed <span className="proof-dot">·</span> Works on your phone</div>
          </div>
          <div className="hero-art" aria-label="Illustration of a virtual physics laboratory">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="art-label label-top"><span className="pulse" /> INTERACTIVE SIMULATION</div>
            <svg className="hero-illustration" viewBox="0 0 440 340" role="img" aria-label="A mass-and-pulley physics experiment">
              <defs><linearGradient id="metal" x1="0" x2="1"><stop stopColor="#83a4b8"/><stop offset=".5" stopColor="#e2f1f6"/><stop offset="1" stopColor="#66899e"/></linearGradient><linearGradient id="block" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#59e0bf"/><stop offset="1" stopColor="#159d91"/></linearGradient></defs>
              <ellipse cx="222" cy="304" rx="156" ry="16" fill="#102b3b"/>
              <path d="M105 282 V69 Q105 55 119 55 H321 Q335 55 335 69 V282" fill="none" stroke="#345467" strokeWidth="10" strokeLinecap="round"/>
              <path d="M112 277 V76 Q112 64 124 64 H316 Q328 64 328 76 V277" fill="none" stroke="#7295a8" strokeWidth="2" opacity=".65"/>
              <path d="M124 64 H316" stroke="url(#metal)" strokeWidth="9" strokeLinecap="round"/>
              <circle cx="220" cy="81" r="31" fill="#183648" stroke="#7e9dad" strokeWidth="6"/>
              <circle cx="220" cy="81" r="22" fill="#274b60" stroke="#a3c1cf" strokeWidth="2"/>
              <circle cx="220" cy="81" r="6" fill="#d8e8ee"/>
              <path d="M198 81 A22 22 0 0 1 242 81" fill="none" stroke="#d4e4ea" strokeWidth="3" strokeLinecap="round"/>
              <path d="M202 83 V173 Q202 180 195 180 H170 V202 M238 83 V143 Q238 150 245 150 H270 V216" fill="none" stroke="#d9e9ee" strokeWidth="3"/>
              <rect x="142" y="202" width="56" height="62" rx="7" fill="url(#block)" stroke="#a0f2df" strokeWidth="2"/>
              <rect x="247" y="216" width="56" height="76" rx="7" fill="#ffb86b" stroke="#ffe0ae" strokeWidth="2"/>
              <path d="M151 213 H189 M256 227 H294" stroke="#fff" strokeWidth="2" opacity=".35"/>
              <text x="170" y="237" fill="#effffb" textAnchor="middle" fontSize="17" fontWeight="700">m₁</text>
              <text x="275" y="255" fill="#51351b" textAnchor="middle" fontSize="17" fontWeight="700">m₂</text>
              <path d="M170 273 V287 M275 301 V312" stroke="#6e91a4" strokeWidth="2" strokeDasharray="3 4"/>
              <g transform="translate(316 125)"><rect width="94" height="42" rx="10" fill="#132f40" stroke="#2b4e60"/><text x="47" y="17" fill="#8caebf" textAnchor="middle" fontSize="9" letterSpacing="1">ACCELERATION</text><text x="47" y="32" fill="#5be1bf" textAnchor="middle" fontSize="13" fontWeight="700">a = F / m</text></g>
              <g transform="translate(22 119)"><rect width="94" height="42" rx="10" fill="#132f40" stroke="#2b4e60"/><text x="47" y="17" fill="#8caebf" textAnchor="middle" fontSize="9" letterSpacing="1">GRAVITY</text><text x="47" y="32" fill="#ffbe78" textAnchor="middle" fontSize="13" fontWeight="700">g = 9.81</text></g>
              <circle cx="355" cy="230" r="3" fill="#5be1bf"/><circle cx="74" cy="220" r="4" fill="#ffbe78"/><circle cx="348" cy="61" r="3" fill="#5be1bf"/>
            </svg>
            <div className="art-label label-bottom"><span>01</span> NEWTON'S LAWS IN ACTION</div>
          </div>
        </section>

        <section className="stats-strip" aria-label="Platform features">
          <div><span className="stat-icon">◉</span><span><b>Made for UACE</b><small>Aligned to A-level learning</small></span></div>
          <div><span className="stat-icon">↗</span><span><b>Learn by doing</b><small>Change values, see results</small></span></div>
          <div><span className="stat-icon">⌁</span><span><b>Phone-friendly</b><small>Lightweight and accessible</small></span></div>
          <div><span className="stat-icon">♡</span><span><b>Always free</b><small>Knowledge for everyone</small></span></div>
        </section>

        <section className="lab-section" id="lab">
          <div className="section-heading"><div><div className="eyebrow">THE EXPERIMENT ROOM</div><h2>Step inside the <em>virtual lab.</em></h2></div><span className="live-tag"><i /> LAB READY</span></div>
          <div className="lab-layout">
            <aside className="experiment-list" id="experiments">
              <div className="list-caption">CHOOSE AN EXPERIMENT</div>
              <button className={experiment === 'atwood' ? 'experiment-option selected' : 'experiment-option'} onClick={() => setExperiment('atwood')}><span className="experiment-icon pulley">⚖</span><span><b>Atwood machine</b><small>Forces & acceleration</small></span><span className="option-arrow">↗</span></button>
              <button className={experiment === 'projectile' ? 'experiment-option selected' : 'experiment-option'} onClick={() => setExperiment('projectile')}><span className="experiment-icon projectile">➶</span><span><b>Projectile motion</b><small>Motion in 2D</small></span><span className="soon">SOON</span></button>
              <button className={experiment === 'ohm' ? 'experiment-option selected' : 'experiment-option'} onClick={() => setExperiment('ohm')}><span className="experiment-icon circuit">ϟ</span><span><b>Ohm's law</b><small>Electric circuits</small></span><span className="soon">SOON</span></button>
              <div className="syllabus-note"><span>✦</span><p><b>Built for your syllabus</b><br />More UACE experiments are on the way.</p></div>
            </aside>

            <div className="simulation-panel">
              {experiment === 'atwood' ? <>
                <div className="sim-top"><div><span className="sim-number">EXPERIMENT 01</span><h3>Atwood machine</h3><p>Investigate how mass affects acceleration.</p></div><span className="interactive-tag">● INTERACTIVE</span></div>
                <div className="sim-canvas">
                  <div className="canvas-grid" />
                  <svg viewBox="0 0 520 260" className="machine-svg" role="img" aria-label="Atwood machine with two hanging masses">
                    <defs><linearGradient id="weightA" x1="0" x2="1"><stop stopColor="#20b99f"/><stop offset="1" stopColor="#58e1c0"/></linearGradient><linearGradient id="weightB" x1="0" x2="1"><stop stopColor="#e79a4f"/><stop offset="1" stopColor="#ffd096"/></linearGradient></defs>
                    <path d="M90 224 V39 Q90 29 100 29 H420 Q430 29 430 39 V224" fill="none" stroke="#2e4b5c" strokeWidth="7" strokeLinecap="round"/>
                    <path d="M97 224 V40 Q97 36 103 36 H417 Q423 36 423 40 V224" fill="none" stroke="#557486" strokeWidth="1.5"/>
                    <path d="M110 36 H410" stroke="#8da9b8" strokeWidth="6" strokeLinecap="round"/>
                    <circle cx="260" cy="54" r="23" fill="#183648" stroke="#87a7b7" strokeWidth="4"/><circle cx="260" cy="54" r="16" fill="#294b5e" stroke="#c0d4de" strokeWidth="1.5"/><circle cx="260" cy="54" r="4" fill="#d8e8ee"/>
                    <path d={`M244 54 V${Math.max(82, 122 - displacement * 22)} Q244 ${Math.max(82, 122 - displacement * 22) + 4} 237 ${Math.max(82, 122 - displacement * 22) + 4} H${205}`} fill="none" stroke="#d7e5eb" strokeWidth="2.5"/>
                    <path d={`M276 54 V${Math.min(170, 118 + displacement * 22)} Q276 ${Math.min(170, 118 + displacement * 22) + 4} 283 ${Math.min(170, 118 + displacement * 22) + 4} H315`} fill="none" stroke="#d7e5eb" strokeWidth="2.5"/>
                    <rect x="158" y={Math.max(126, 158 - displacement * 22)} width="54" height="54" rx="6" fill="url(#weightA)" stroke="#a2f4df" strokeWidth="1.5"/><text x="185" y={Math.max(126, 158 - displacement * 22) + 31} textAnchor="middle" fill="#073b36" fontSize="16" fontWeight="700">m₁</text>
                    <rect x="308" y={Math.min(172, 154 + displacement * 22)} width="54" height="54" rx="6" fill="url(#weightB)" stroke="#ffe0b2" strokeWidth="1.5"/><text x="335" y={Math.min(172, 154 + displacement * 22) + 31} textAnchor="middle" fill="#573718" fontSize="16" fontWeight="700">m₂</text>
                    <path d="M185 192 V224 M335 226 V238" stroke="#456779" strokeWidth="1.5" strokeDasharray="4 4"/>
                    <text x="185" y="244" textAnchor="middle" fill="#8da9b8" fontSize="11">{massA.toFixed(1)} kg</text><text x="335" y="244" textAnchor="middle" fill="#8da9b8" fontSize="11">{massB.toFixed(1)} kg</text>
                    {running && <g><circle cx="260" cy="54" r="31" fill="none" stroke="#5be1bf" strokeWidth="1.5" strokeDasharray="4 5"/><text x="260" y="14" textAnchor="middle" fill="#5be1bf" fontSize="10">RUNNING</text></g>}
                  </svg>
                  <div className="canvas-caption"><span><i /> LIVE MODEL</span><span>Ideal pulley · negligible friction</span></div>
                </div>
                <div className="controls">
                  <div className="control-row"><div><label htmlFor="mass-a">Mass 1 <span className="mass-color green" /></label><small>Left-hand side</small></div><div className="slider-control"><input id="mass-a" type="range" min="1" max="10" step=".5" value={massA} onChange={e => {setMassA(Number(e.target.value)); reset()}}/><output>{massA.toFixed(1)} <small>kg</small></output></div></div>
                  <div className="control-row"><div><label htmlFor="mass-b">Mass 2 <span className="mass-color orange" /></label><small>Right-hand side</small></div><div className="slider-control"><input id="mass-b" type="range" min="1" max="10" step=".5" value={massB} onChange={e => {setMassB(Number(e.target.value)); reset()}}/><output>{massB.toFixed(1)} <small>kg</small></output></div></div>
                  <div className="sim-actions"><button className="run-btn" onClick={() => { if (running) { setRunning(false) } else { setTime(t => t + 1); setRunning(true) } }}>{running ? 'Ⅱ Pause experiment' : '▶ Run experiment'}</button><button className="reset-btn" onClick={reset}>↺ Reset</button><span className="time-readout">t = {time.toFixed(1)} s</span></div>
                </div>
                <div className="results">
                  <div className="result-heading"><span>MEASURED RESULTS</span><span>Calculated from Newton's 2nd law</span></div>
                  <div className="result-cards"><div className="result-card"><small>Acceleration, |a|</small><strong>{Math.abs(acceleration).toFixed(2)} <i>m/s²</i></strong><span>{massA === massB ? 'Balanced masses' : (massB > massA ? 'm₂ moves down ↓' : 'm₁ moves down ↓')}</span></div><div className="result-card"><small>String tension, T</small><strong>{tension.toFixed(2)} <i>N</i></strong><span>Assuming a light string</span></div><div className="result-card"><small>Weight difference</small><strong>{Math.abs(massB - massA) * 9.81 .toFixed?.(2) || (Math.abs(massB-massA)*9.81).toFixed(2)} <i>N</i></strong><span>Driving force</span></div></div>
                  <div className="formula-box"><span>THEORY</span><code>|a| = |m₂ − m₁|g / (m₁ + m₂)</code><span className="formula-note">g = 9.81 m/s²</span></div>
                </div>
              </> : <div className="coming-panel"><span className="coming-icon">{experiment === 'projectile' ? '➶' : 'ϟ'}</span><span className="sim-number">COMING NEXT</span><h3>{experiment === 'projectile' ? 'Projectile motion' : "Ohm's law"}</h3><p>{experiment === 'projectile' ? 'Explore launch angle, initial speed, flight time and range.' : 'Change voltage and resistance to investigate current and resistance.'}</p><button className="reset-btn" onClick={() => setExperiment('atwood')}>Back to Atwood machine</button></div>}
            </div>
          </div>
        </section>

        <section className="learning-section" id="about"><div><div className="eyebrow">SCIENCE SHOULD BE FOR EVERYONE</div><h2>Understand the <em>why.</em><br />Not just the formula.</h2></div><p>PhysicsLab UG is being built to make practical Physics easier to explore, even when you don't have lab equipment or fast internet. Start with one variable, observe what changes, and build your understanding.</p></section>
      </main>
      <footer><a className="brand footer-brand" href="#"><span className="brand-mark">P<span>+</span></span><span>PhysicsLab <b>UG</b><small>LEARN BY EXPERIMENTING</small></span></a><span>Made for curious minds in Uganda 🇺🇬</span><span>Free to explore · Built for learning</span></footer>
    </div>
  )
}

export default App
