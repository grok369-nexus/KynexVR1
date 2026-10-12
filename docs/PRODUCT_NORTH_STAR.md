# PhysicsLab UG — Product North Star

## Mission
Make physics feel like a world a learner can interrogate, not a set of facts they must memorize. The intended user is a curious A-level/UACE learner who asks deeper questions: What force is acting? Why does the graph bend? What changes if an assumption is removed? How would I know if the model is wrong?

## Product identity: a scientific instrument
- Deep midnight-blue workspaces, precise grid lines, restrained mint/cyan instrumentation, and warm warning accents.
- Readable sans-serif text for explanations and monospaced type for values, units, and model status.
- Motion only when it explains physical change; respect reduced-motion preferences.
- Keep model, visualization, measurement, and interpretation distinct.
- Avoid fake metrics. Every displayed value must have a defined meaning.
- Keep the simulation central and controls thumb-friendly on mobile.

## Signature learning loop
1. **Question:** What do I want to understand?
2. **Predict:** What do I expect, and why?
3. **Configure:** Choose masses, charge, angle, material, or initial velocity.
4. **Run:** Observe the system evolve.
5. **Measure:** Read relevant time, position, velocity, force, energy, voltage, or other quantities.
6. **Compare:** Overlay data with model prediction and examine the discrepancy.
7. **Explain:** Connect observations to a law, derive the result, and state assumptions.
8. **Preserve:** Export or share a reproducible experiment state and observations.

## Engineering principles
- Use SI units internally; format values only at the presentation boundary.
- Keep calculations independent of React components and visual coordinates.
- Document assumptions and valid input ranges for each model.
- Test known answers, limiting cases, symmetry, edge cases, and numerical convergence.
- Label analytical solutions and numerical integrations clearly.
- Never imply an unsupported system is solved merely because it is animated.
- Separate simulation time from display refresh and avoid unnecessary rendering work.
- Provide keyboard-operable controls, labels, readable contrast, and reduced-motion behavior.
- Keep core learning free and avoid requiring an account for basic experiments.

## Roadmap

### Phase 1 — Trustworthy core (current)
- Searchable research-console dashboard and mobile-responsive navigation.
- Shared physics engine, automated tests, and CI build.
- Foundational mechanics experiments and session notebook.
- Clearly label schematic and simplified representations.

### Phase 2 — Scientific method
- Prediction input before running an experiment.
- Time-series recording with measured and theoretical values.
- Live position-time, velocity-time, acceleration-time, and relevant energy/force graphs.
- CSV export and reproducible experiment setup sharing.
- Prompts that ask learners what changed and why.

### Phase 3 — Connected physical systems
- Constraint solver for strings, pulleys, and contact.
- Collisions, impulses, torque, angular momentum, and rigid-body rotation.
- Energy/momentum diagnostics and numerical stability indicators.
- Force diagrams linked to the solved model.

### Phase 4 — Wider physical world
- Electric fields from charge configurations, equipotentials, and potential energy.
- DC circuits with current, voltage, and resistance relationships.
- Waves, superposition, resonance, sound, and optics.
- Thermal models, gas laws, and energy transfer.
- Magnetism, induction, and selected modern-physics experiments.
- Gravity and orbital systems with explicit model limits.

### Phase 5 — Uganda-first field learning
- UACE syllabus map, practical skills, derivations, and exam-style investigations.
- Low-data/offline lesson packs and graceful recovery after connection loss.
- Teacher-authored challenges and printable lab sheets.
- Testing on entry-level Android phones and slow networks.

## Honest product review — current snapshot
Scores are a design review of the current prototype, not a claim of superiority over other products.

| Dimension | Score | Reason |
|---|---:|---|
| Visual identity | 7/10 | Strong dark instrument aesthetic; original scientific scenes and user testing still needed |
| Mobile direction | 7/10 | Responsive layout exists; real low-end phone testing remains |
| Experiment discoverability | 8/10 | Search finds experiment entries and opens the selected one |
| Physics breadth | 3/10 | Only a small part of A-level physics is implemented with meaningful models |
| Model fidelity | 5/10 | Some mechanics models are tested; some entries remain schematic or simplified |
| Measurement workflow | 3/10 | Session observations exist; graphs, uncertainty, export, and reproducible states remain |
| Verification | 8/10 | Shared physics tests and build checks run in CI |
| Offline resilience | 2/10 | Offline caching and downloadable lab packs are not built |

## The bar to aim for
Do not optimize for the largest number of simulations. Optimize for the number of systems a learner can investigate deeply, correctly, and independently. A small set of trustworthy, measurable, explainable experiments is more valuable than a large catalogue of attractive but misleading animations.

The next best milestone is a **prediction-and-measurement workbench** that links the model, live scene, graph, and recorded data into one coherent scientific workflow.
