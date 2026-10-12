# PhysicsLab UG

**Learn by experimenting.** A free, mobile-first virtual Physics laboratory for A-level/UACE learners in Uganda.

## Current prototype

- Responsive Physics learning landing page
- Interactive Atwood machine model
- Adjustable masses with live acceleration, tension, and driving-force calculations
- Ideal pulley model using \(g = 9.81\,\text{m/s}^2\)
- Experiment navigation prepared for projectile motion and Ohm's law

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Technology

- React + TypeScript
- Vite
- CSS responsive layout and SVG-based simulation
- No account, database, or paid API required for this prototype

## Learning model

For an ideal Atwood machine with masses \(m_1\) and \(m_2\):

\[
|a| = \frac{|m_2-m_1|g}{m_1+m_2}
\]

The string tension is:

\[
T = \frac{2m_1m_2g}{m_1+m_2}
\]

This is an educational idealization: the pulley and string are treated as massless, and friction is neglected.

## Roadmap

1. Improve the experiment's time-based motion and measurement controls.
2. Add projectile motion with angle, initial speed, trajectory, range, and flight time.
3. Add Ohm's law with a virtual circuit and live meter readings.
4. Add UACE topic notes, worked examples, and practice questions.
5. Test performance on entry-level Android phones and slower connections.

## License

Open educational prototype. A formal license can be added before wider distribution.
