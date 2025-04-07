export interface UltigenMonster {
  id: number
  name: string
  element: string;
  image: string;
  monsterId: number,
  level: number
  stage: number
  xp: number
  skills: any[],
  walkSpeed: number
  attackDamage: number
  aspd: number
  health: number
  behavior: string
  dps: number
}