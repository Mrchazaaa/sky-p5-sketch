export const SCENE_CONSTANTS = {
  mobileBreakpoint: 768,
  cloud: {
    maxPoints: 8,
    minPoints: 4,
    widthScale: 0.2,
    minRadiusScale: 1.8,
    maxRadiusScale: 2.3,
    speeds: [12, 13, 15],
    initialCount: 4,
    countLimit: 15,
    creationSuccessRate: 0.005,
    maxTimeStepSeconds: 0.1,
    yRange: 0.5,
  },
  moon: {
    desktop: {
      baseSize: 100,
      widthScale: 0.05,
      topOffsetRatio: 0.1,
      rightOffsetRatio: 0.3,
    },
    mobile: {
      baseSize: 80,
      widthScale: 0.03,
      topOffsetRatio: 0.05,
      rightOffsetRatio: 0.1,
    },
  },
};
