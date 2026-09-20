export type HeroState = 'default' | 'left' | 'right' | 'up' | 'center';
export interface HeroSceneAPI {
  setState(state: HeroState): void;
  setFlightProgress(progress: number | null): void;
  getStats(): { triangles: number; drawCalls: number; animations: string[] };
  dispose(): void;
}
export function mountHeroScene(container: HTMLElement, options?: {
  modelUrl?: string;
  eventTarget?: HTMLElement;
  onState?: (state: HeroState) => void;
}): Promise<HeroSceneAPI>;
