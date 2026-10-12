import test from 'node:test'
import assert from 'node:assert/strict'
import {
  applyForce,
  createBody,
  createWorld,
  stepWorld,
} from '../.physics-test-build/world.js'
import {
  solveAtwood,
  solveTableHangingMass,
  solveCircularMotion,
  solveCoulombForce,
  solveInclinedPlane,
  solvePendulum,
  solveProjectile,
  projectileState,
} from '../.physics-test-build/engine.js'

const near = (actual, expected, tolerance = 1e-3) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}`,
  )
}

test('Atwood machine returns signed acceleration and correct tension', () => {
  const model = solveAtwood(2, 4)
  assert.equal(model.valid, true)
  near(model.acceleration, 3.27)
  near(model.tension, 26.16)
})

test('equal Atwood masses have zero acceleration and non-zero tension', () => {
  const model = solveAtwood(3, 3)
  near(model.acceleration, 0)
  near(model.tension, 29.43)
})

test('Atwood machine flags non-physical masses', () => {
  assert.equal(solveAtwood(0, 2).valid, false)
  assert.equal(solveAtwood(-1, 2).valid, false)
})

test('table block and hanging mass obey Newton laws and ideal-string constraint', () => {
  const model = solveTableHangingMass(3, 2)
  assert.equal(model.valid, true)
  near(model.acceleration, 2 * 9.81 / 5)
  near(model.tension, 3 * 2 * 9.81 / 5)
  near(model.tableBlockWeight, 3 * 9.81)
  near(model.tableNormalReaction, 3 * 9.81)
  near(model.hangingWeight - model.tension, 2 * model.acceleration)
})

test('table-and-hanging-mass model rejects invalid physical inputs', () => {
  assert.equal(solveTableHangingMass(0, 2).valid, false)
  assert.equal(solveTableHangingMass(2, -1).valid, false)
  assert.equal(solveTableHangingMass(2, 1, 0).valid, false)
  assert.equal(solveTableHangingMass(Number.NaN, 1).valid, false)
})

test('projectile model agrees with standard level-ground equations', () => {
  const model = solveProjectile(20, 30)
  near(model.flightTime, 2.039, 0.002)
  near(model.range, 35.31, 0.03)
  near(model.maximumHeight, 5.097, 0.01)
  const landing = projectileState(model, model.flightTime)
  near(landing.position.y, 0)
  near(landing.position.x, model.range)
})

test('inclined plane without friction accelerates down the slope', () => {
  const model = solveInclinedPlane(2, 30, 0, 0)
  near(model.normalReaction, 2 * 9.81 * Math.cos(Math.PI / 6))
  near(model.acceleration, 9.81 * Math.sin(Math.PI / 6))
  assert.equal(model.staysAtRest, false)
})

test('pendulum period follows the small-angle model', () => {
  const model = solvePendulum(1, 5)
  near(model.period, 2 * Math.PI / Math.sqrt(9.81))
  near(model.frequency, 1 / model.period)
})

test('circular motion uses a = v²/r and F = mv²/r', () => {
  const model = solveCircularMotion(0.5, 4, 2)
  near(model.acceleration, 8)
  near(model.centripetalForce, 4)
  near(model.angularSpeed, 2)
  near(model.period, Math.PI)
})

test('Coulomb force handles attraction, repulsion, and neutral charges', () => {
  const attractive = solveCoulombForce(1, -2, 0.5)
  near(attractive.magnitude, 0.0719004, 1e-5)
  assert.equal(attractive.type, 'attractive')

  const repulsive = solveCoulombForce(1, 2, 0.5)
  assert.equal(repulsive.type, 'repulsive')

  const neutral = solveCoulombForce(0, 2, 0.5)
  near(neutral.magnitude, 0)
  assert.equal(neutral.type, 'no-force')
})


test('world applies Newton second law and advances deterministically', () => {
  const body = createBody({
    id: 'cart',
    mass: 2,
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  })
  const world = createWorld([body], { x: 0, y: 0 })
  const moved = stepWorld(applyForce(world, 'cart', { x: 10, y: 0 }), 0.1)
  near(moved.bodies[0].velocity.x, 0.5)
  near(moved.bodies[0].position.x, 0.05)
  near(moved.time, 0.1)
  near(world.bodies[0].position.x, 0)
})

test('world applies gravity and clears one-step applied forces', () => {
  const body = createBody({
    id: 'drop',
    mass: 1,
    position: { x: 0, y: 10 },
    velocity: { x: 0, y: 0 },
  })
  const world = createWorld([body])
  const afterOne = stepWorld(world, 0.1)
  near(afterOne.bodies[0].velocity.y, -0.981)
  near(afterOne.bodies[0].position.y, 9.9019)
  near(afterOne.bodies[0].force.x, 0)
  const afterTwo = stepWorld(afterOne, 0.1)
  near(afterTwo.bodies[0].velocity.y, -1.962)
})

test('world keeps fixed anchors immobile and rejects invalid steps', () => {
  const anchor = createBody({
    id: 'anchor',
    mass: 1,
    position: { x: 3, y: 4 },
    velocity: { x: 5, y: 6 },
    fixed: true,
  })
  const world = createWorld([anchor])
  const after = stepWorld(world, 0.1)
  near(after.bodies[0].position.x, 3)
  near(after.bodies[0].position.y, 4)
  near(after.bodies[0].velocity.x, 0)
  assert.throws(() => stepWorld(world, 0), /positive/)
  assert.throws(() => createWorld([anchor, anchor]), /Duplicate/)
})
