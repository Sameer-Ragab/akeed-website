'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { assetPath } from '@/lib/asset-path';
import { mountHeroScene } from './hero-scene';
import styles from './FlyAkeedHero.module.css';

/** Keep your existing HTML search UI in children. Asset URLs assume public/fly-akeed. */
export default function FlyAkeedHero({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const host = useRef<HTMLElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    if (!host.current || !canvasHost.current) return;
    let cancelled = false;
    let instance: Awaited<ReturnType<typeof mountHeroScene>> | undefined;
    mountHeroScene(canvasHost.current, { modelUrl: assetPath('/fly-akeed/scene.glb'), eventTarget: host.current })
      .then(api => {
        if (cancelled) { api.dispose(); return; }
        instance = api;
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('fallback'); });
    return () => { cancelled = true; instance?.dispose(); };
  }, []);

  return (
    <section ref={host} className={`${styles.hero} ${className}`} aria-label="Travel destinations" tabIndex={0}>
      <div className={styles.scene} aria-hidden="true">
        <img className={styles.fallback} src={assetPath('/fly-akeed/fallback.png')} alt="" />
        <div ref={canvasHost} className={styles.canvasHost} />
      </div>
      {status === 'loading' && <span className={styles.status} role="status">جارٍ تجهيز المشهد…</span>}
      <div className={styles.content} data-hero-ui>{children}</div>
    </section>
  );
}
