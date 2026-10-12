# PhysicsLab UG: Physics-world foundation

## Vision

PhysicsLab UG aims to be an inspectable digital model of physical reality for learning: students can build a situation, change its initial conditions, run it, measure what happens, and inspect the laws and assumptions that explain the result.

It is not enough for an animation to look plausible. Every displayed result should come from an explicit model, declared units, initial conditions, and a documented numerical method or analytic solution.

## Architecture principles

1. **Model first, visuals second.** React/SVG components display simulation state; they should not independently reimplement physics equations.
2. **SI units internally.** Use kg, m, s, N, C, V, A and other SI units in the simulation core. Convert only at UI boundaries.
3. **Explicit assumptions.** Label idealizations such as massless strings, frictionless pulleys, point masses, uniform gravity, small-angle pendulums, or no air resistance.
4. **Deterministic stepping.** Given the same initial state, inputs, and time steps, the world should produce the same results.
5. **Test laws, not screenshots alone.** Check conservation laws and known limiting cases as well as expected numerical values.
6. **Inspectability.** Make position, velocity, acceleration, forces, energy, constraints, and numerical settings available to the learning UI.
7. **Honest model boundaries.** Never silently show a simplified result as if it came from a complete physical model.
8. **Progressive realism.** Start with point-mass translation; add contacts, strings, pulleys, rotation, circuits, waves and fields as separately tested capabilities.

## Current layers

- `src/physics/engine.ts`: analytic models for selected UACE experiments.
- `src/physics/world.ts`: first general world stepper for point-mass bodies, applied forces, gravity, fixed anchors, and semi-implicit Euler integration.
- `src/*Lab.tsx`: interactive presentation and controls.
- `tests/physics-engine.test.mjs`: regression tests for analytic models and the first general world stepper.

## Current world-step equations

For a non-fixed body:

\[
\mathbf F_{total}=\mathbf F_{applied}+m\mathbf g
\]

\[
\mathbf a=\frac{\mathbf F_{total}}{m}
\]

The current stepper uses semi-implicit Euler:

\[
\mathbf v_{n+1}=\mathbf v_n+\mathbf a_n\Delta t
\]

\[
\mathbf x_{n+1}=\mathbf x_n+\mathbf v_{n+1}\Delta t
\]

Applied forces are one-step inputs and are cleared after the step. Gravity acts continuously. Fixed bodies represent immovable anchors.

This is a first approximation, not a full reality engine. It currently has no collision detection, rope-length constraints, pulley wrap/contact solving, rigid-body rotation, fluid dynamics, or adaptive Runge-Kutta integration. Those capabilities must be added deliberately and tested before being used in experiments.

## Next engineering milestones

1. Validate inputs and test core mechanics against known solutions.
2. Add a constraint layer for fixed joints and taut inextensible strings.
3. Build and test a block-plus-hanging-mass system with tension and contact.
4. Add collision detection and contact response with explicit restitution/friction assumptions.
5. Add rotational inertia and torque, then pulley dynamics.
6. Add energy/momentum diagnostics and timestep/convergence checks.
7. Connect the model state to the UI's live vectors, plots, readings, and experiment notebook.
8. Profile and test on low-memory Android devices and slower connections.

## References for design study

- PhET: https://phet.colorado.edu/
- PhysicsHub: https://physicshub.github.io/
- oPhysics: https://ophysics.com/
- The Physics Aviary: https://thephysicsaviary.com/
- MyPhysicsLab: https://www.myphysicslab.com/

These are inspiration and study references, not a claim that their code or assets are part of this project. Review licences and attribution before reusing any third-party implementation or assets.
