/**
 * PhysicsLab UG shared physics engine.
 *
 * Pure, unit-aware models used by the interactive labs. Visual components should
 * render these results rather than re-implementing the same equations.
 * SI units throughout: kg, m, s, N, m/s, m/s².
 */
export type Vec2 = Readonly<{ x: number; y: number }>

export const radians = (degrees: number) => degrees * Math.PI / 180
export const clampTime = (time: number, endTime: number) => Math.max(0, Math.min(time, endTime))

export const vector = {
  add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
  subtract: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
  scale: (v: Vec2, scalar: number): Vec2 => ({ x: v.x * scalar, y: v.y * scalar }),
  magnitude: (v: Vec2): number => Math.hypot(v.x, v.y),
  dot: (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y,
}

export type ProjectileModel = {
  horizontalVelocity: number
  verticalVelocity: number
  flightTime: number
  range: number
  maximumHeight: number
  timeToApex: number
}

export function solveProjectile(speed: number, angleDegrees: number, launchHeight = 0, gravity = 9.81): ProjectileModel {
  const angle = radians(angleDegrees)
  const horizontalVelocity = speed * Math.cos(angle)
  const verticalVelocity = speed * Math.sin(angle)
  const flightTime = (verticalVelocity + Math.sqrt(verticalVelocity ** 2 + 2 * gravity * launchHeight)) / gravity
  return {
    horizontalVelocity,
    verticalVelocity,
    flightTime,
    range: horizontalVelocity * flightTime,
    maximumHeight: launchHeight + verticalVelocity ** 2 / (2 * gravity),
    timeToApex: verticalVelocity / gravity,
  }
}

export function projectileState(model: ProjectileModel, time: number, launchHeight = 0, gravity = 9.81) {
  const t = clampTime(time, model.flightTime)
  const height = Math.max(0, launchHeight + model.verticalVelocity * t - 0.5 * gravity * t ** 2)
  const verticalVelocity = model.verticalVelocity - gravity * t
  return {
    time: t,
    position: { x: model.horizontalVelocity * t, y: height } as Vec2,
    velocity: { x: model.horizontalVelocity, y: verticalVelocity } as Vec2,
    speed: Math.hypot(model.horizontalVelocity, verticalVelocity),
  }
}

export function solveAtwood(mass1: number, mass2: number, gravity = 9.81) {
  const totalMass = mass1 + mass2
  if (mass1 <= 0 || mass2 <= 0 || totalMass <= 0 || gravity <= 0) {
    return { acceleration: 0, tension: 0, valid: false as const }
  }
  return {
    acceleration: ((mass2 - mass1) * gravity) / totalMass,
    tension: (2 * mass1 * mass2 * gravity) / totalMass,
    valid: true as const,
  }
}

export type InclinedPlaneModel = {
  weight: number
  componentDownSlope: number
  normalReaction: number
  maximumStaticFriction: number
  friction: number
  netForceDownSlope: number
  acceleration: number
  staysAtRest: boolean
}

export function solveInclinedPlane(mass: number, angleDegrees: number, muStatic: number, muKinetic: number, gravity = 9.81): InclinedPlaneModel {
  const angle = radians(angleDegrees)
  const weight = mass * gravity
  const componentDownSlope = weight * Math.sin(angle)
  const normalReaction = weight * Math.cos(angle)
  const maximumStaticFriction = Math.max(0, muStatic) * normalReaction
  const staysAtRest = componentDownSlope <= maximumStaticFriction
  const friction = staysAtRest ? componentDownSlope : Math.max(0, muKinetic) * normalReaction
  const netForceDownSlope = staysAtRest ? 0 : componentDownSlope - friction
  return {
    weight,
    componentDownSlope,
    normalReaction,
    maximumStaticFriction,
    friction,
    netForceDownSlope,
    acceleration: mass > 0 ? netForceDownSlope / mass : 0,
    staysAtRest,
  }
}

export type PendulumModel = {
  angularFrequency: number
  period: number
  frequency: number
  initialAngleRadians: number
  maximumSpeed: number
}

export function solvePendulum(length: number, amplitudeDegrees: number, gravity = 9.81): PendulumModel {
  const safeLength = Math.max(length, 0.0001)
  const safeGravity = Math.max(gravity, 0.0001)
  const angularFrequency = Math.sqrt(safeGravity / safeLength)
  const period = 2 * Math.PI / angularFrequency
  const initialAngleRadians = radians(amplitudeDegrees)
  return {
    angularFrequency,
    period,
    frequency: 1 / period,
    initialAngleRadians,
    maximumSpeed: Math.sqrt(2 * safeGravity * safeLength * (1 - Math.cos(initialAngleRadians))),
  }
}

export function pendulumState(length: number, mass: number, model: PendulumModel, time: number, gravity = 9.81) {
  const angle = model.initialAngleRadians * Math.cos(model.angularFrequency * time)
  const angularVelocity = -model.initialAngleRadians * model.angularFrequency * Math.sin(model.angularFrequency * time)
  const speed = Math.abs(length * angularVelocity)
  return {
    angle,
    angularVelocity,
    speed,
    tension: mass * gravity * Math.cos(angle) + mass * length * angularVelocity ** 2,
  }
}

export function solveCircularMotion(mass: number, speed: number, radius: number) {
  const safeRadius = Math.max(radius, 0.0001)
  const acceleration = speed ** 2 / safeRadius
  return { acceleration, centripetalForce: mass * acceleration, angularSpeed: speed / safeRadius, period: (2 * Math.PI * safeRadius) / Math.max(speed, 0.0001) }
}

export function solveCoulombForce(charge1MicroCoulombs: number, charge2MicroCoulombs: number, separationMetres: number) {
  const separation = Math.max(separationMetres, 0.000001)
  const signedProduct = charge1MicroCoulombs * charge2MicroCoulombs
  const magnitude = 8.9875517923e9 * Math.abs(signedProduct * 1e-12) / separation ** 2
  return {
    magnitude,
    type: signedProduct === 0 ? 'no-force' as const : signedProduct < 0 ? 'attractive' as const : 'repulsive' as const,
  }
}
