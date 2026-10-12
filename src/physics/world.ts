import { vector, type Vec2 } from './engine.js'

/**
 * First step toward a general-purpose, inspectable physics world.
 *
 * SI units: kg, m, s, N. This version models translational point-mass bodies.
 * It deliberately does not claim to solve rigid-body rotation, contact, or
 * rope/pulley constraints yet.
 */
export type PhysicsBody = Readonly<{
  id: string
  mass: number
  position: Vec2
  velocity: Vec2
  /** External force applied during the next step, in newtons. */
  force: Vec2
  /** A fixed body is an immovable anchor/support. */
  fixed?: boolean
}>

export type PhysicsWorld = Readonly<{
  bodies: readonly PhysicsBody[]
  gravity: Vec2
  time: number
}>

export function createBody(
  body: Omit<PhysicsBody, 'force'> & { force?: Vec2 },
): PhysicsBody {
  if (!body.id.trim()) throw new Error('Body id must not be empty')
  if (!Number.isFinite(body.mass) || body.mass <= 0) {
    throw new Error('Body mass must be a finite positive number')
  }
  for (const value of [body.position.x, body.position.y, body.velocity.x, body.velocity.y]) {
    if (!Number.isFinite(value)) throw new Error('Body position and velocity must be finite')
  }
  return {
    ...body,
    force: body.force ?? { x: 0, y: 0 },
  }
}

export function createWorld(
  bodies: readonly PhysicsBody[] = [],
  gravity: Vec2 = { x: 0, y: -9.81 },
): PhysicsWorld {
  const ids = new Set<string>()
  for (const body of bodies) {
    if (ids.has(body.id)) throw new Error(`Duplicate body id: ${body.id}`)
    ids.add(body.id)
  }
  if (!Number.isFinite(gravity.x) || !Number.isFinite(gravity.y)) {
    throw new Error('Gravity must be finite')
  }
  return { bodies: bodies.map(body => ({ ...body })), gravity: { ...gravity }, time: 0 }
}

/**
 * Advances a world by one fixed time step using semi-implicit Euler:
 * a = F_total / m; v_next = v + a*dt; x_next = x + v_next*dt.
 * This is an approximation; smaller steps usually improve accuracy.
 */
export function stepWorld(world: PhysicsWorld, dt: number): PhysicsWorld {
  if (!Number.isFinite(dt) || dt <= 0) {
    throw new Error('Time step must be a finite positive number')
  }

  const bodies = world.bodies.map(body => {
    if (body.fixed) {
      return { ...body, velocity: { x: 0, y: 0 }, force: { x: 0, y: 0 } }
    }

    const gravityForce = vector.scale(world.gravity, body.mass)
    const totalForce = vector.add(body.force, gravityForce)
    const acceleration = vector.scale(totalForce, 1 / body.mass)
    const velocity = vector.add(body.velocity, vector.scale(acceleration, dt))
    const position = vector.add(body.position, vector.scale(velocity, dt))

    return { ...body, position, velocity, force: { x: 0, y: 0 } }
  })

  return { ...world, bodies, time: world.time + dt }
}

/** Adds a force to one body for the next step; the input world is not mutated. */
export function applyForce(world: PhysicsWorld, bodyId: string, force: Vec2): PhysicsWorld {
  if (!Number.isFinite(force.x) || !Number.isFinite(force.y)) {
    throw new Error('Applied force must be finite')
  }
  let found = false
  const bodies = world.bodies.map(body => {
    if (body.id !== bodyId) return body
    found = true
    return { ...body, force: vector.add(body.force, force) }
  })
  if (!found) throw new Error(`Unknown body id: ${bodyId}`)
  return { ...world, bodies }
}
