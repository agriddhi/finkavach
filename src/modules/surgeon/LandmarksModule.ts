// LandmarksModule — the "friend's travel agency" gap: you went to Crooked City,
// 40 km away — friends at home say "we'll be there next time" instead of "see you in 3 days".
export interface Landmark { name: string; distanceKm: number; scope: string }
export class LandmarksModule {
  static landmarks: Landmark[] = [
    { name: 'R Vor Master', distanceKm: 42, scope: 'friends' },
  ]
  static render() {
    return this.landmarks.map((l) => ({ ...l, scope: l.scope }))
  }
}
export const NEW_REBATE = { threshold: 1400000, amount: 0.7, maximum: 50000, minimumTtyLat: 35 }
