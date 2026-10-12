# PhysicsLab UG

**The universe has rules. Test them.**

PhysicsLab UG is a free, mobile-first virtual physics laboratory for Uganda's A-level/UACE learners and curious self-directed students. The ambition is not a collection of formula calculators. It is to let learners configure a physical model, change initial conditions, observe consequences, inspect equations, and compare predictions with evidence.

## Product principles

- **Model first, graphics second:** every moving object and readout should come from an explicit physical model.
- **Expose the invisible:** show forces, fields, vectors, constraints, and energy when they explain what happens.
- **More than animation:** link scenes to equations, readings, graphs, and eventually exportable measurement data.
- **Honest assumptions:** state idealizations and known limitations.
- **Inquiry before answers:** encourage prediction, controlled variable changes, measurement, and explanation.
- **Mobile-first and affordable:** keep the core free, responsive, and light enough for entry-level Android devices and weaker connections.
- **Test the laws:** use unit tests, limiting cases, and numerical convergence checks where relevant.

## Current prototype

- Responsive research-console dashboard with searchable experiment entries.
- Interactive ideal Atwood machine workshop.
- Interactive block-on-table + hanging-mass lab with adjustable masses and gravity.
- Projectile-motion, inclined-plane, and pendulum lab interfaces.
- Free-fall, Coulomb-force, electric-charge, and circular-motion explorations.
- Session-based observation notebook.
- Shared TypeScript physics functions and a point-mass world-stepper foundation.
- Automated physics tests and production build checks in GitHub Actions.

**Scope note:** the catalogue is ahead of the fully implemented physics. Some electrostatics and circular-motion entries share simplified exploratory visualizations; the electric-field pattern is schematic rather than a numerically solved field map. The general world-stepper does not yet solve arbitrary rope/pulley constraints, rigid-body rotation, collisions, or fluid motion. These are roadmap items, not capabilities to assume are complete.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Run tests and build:

```bash
npm run test:physics
npm run build
npm run preview
```

## Technology

- React + TypeScript
- Vite
- SVG and responsive CSS for lightweight interactive scenes
- No paid API or account required for the current prototype

## Roadmap

1. Strengthen the workflow: prediction → experiment → measurement → explanation.
2. Add synchronized live graphs, measurement tools, and CSV export.
3. Add a constraint solver for ropes, pulleys, and contact.
4. Add collision response, rotational dynamics, torque, and conservation diagnostics.
5. Build numerically grounded electric-field and potential visualizations.
6. Expand UACE coverage across waves, thermal physics, electricity, magnetism, and modern physics.
7. Add offline-friendly lesson packs, accessible controls, and low-bandwidth performance checks.
8. Validate the learning experience with A-level learners and physics teachers in Uganda.

## Design references

We learn from the principles demonstrated by projects such as PhET and myPhysicsLab: scientific inquiry, immediate feedback, multiple linked representations, inspectable equations, and separation between mathematical model and view. PhysicsLab UG should develop its own identity and original implementations, and respect third-party licenses if code or assets are reused.

## License

This project is an open educational prototype. Choose and add a formal license before inviting outside contributions or redistributing the code.
