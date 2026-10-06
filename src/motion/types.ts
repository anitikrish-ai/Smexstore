export type MotionDurationKey = 'instant' | 'fast' | 'base' | 'slow';
export type MotionEasingKey = 'standard' | 'enter' | 'exit' | 'signature';
export type MotionDistanceKey = 'xs' | 'sm' | 'md' | 'lg';

export interface MotionConfig {
  reducedMotion: boolean;
}
