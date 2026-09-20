'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { assetPath } from '@/lib/asset-path';
import { mountHeroScene } from './hero-scene';
import styles from './FlyAkeedHero.module.css';

/** Keep your existing HTML search UI in children. Asset URLs assume public/fly-akeed. */
export default function FlyAkeedHero({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const host = useRef<HTMLElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current || !canvasHost.current) return;
    let cancelled = false;
    let started = false;
    let fallbackTimer: number | undefined;
    let instance: Awaited<ReturnType<typeof mountHeroScene>> | undefined;

    const startScene = () => {
      if (started || cancelled || !host.current || !canvasHost.current) return;
      started = true;
      mountHeroScene(canvasHost.current, { modelUrl: assetPath('/fly-akeed/scene.glb'), eventTarget: host.current })
        .then((api) => {
          if (cancelled) api.dispose();
          else instance = api;
        })
        .catch(() => undefined);
    };

    const wakeScene = () => startScene();
    host.current.addEventListener('pointerenter', wakeScene, { once: true });
    host.current.addEventListener('focusin', wakeScene, { once: true });
    fallbackTimer = window.setTimeout(startScene, 1100);

    return () => {
      cancelled = true;
      host.current?.removeEventListener('pointerenter', wakeScene);
      host.current?.removeEventListener('focusin', wakeScene);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      instance?.dispose();
    };
  }, []);

  return (
    <section ref={host} className={`${styles.hero} ${className}`} aria-label="Travel destinations" tabIndex={0}>
      <div className={styles.scene} aria-hidden="true">
        <img className={styles.fallback} src={assetPath('/fly-akeed/fallback.png')} alt="" fetchPriority="high" />
        <div ref={canvasHost} className={styles.canvasHost} />
      </div>
      <div className={styles.content} data-hero-ui>{children}</div>
    </section>
  );
}
