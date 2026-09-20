"use client";

import Image from "next/image";
import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { HeroModel } from "./HeroModel";
import { ResponsivePicture } from "./ResponsivePicture";

type DestinationId = "riyadh" | "jeddah" | "alula";

const destinations: Array<{ id: DestinationId; city: string; detail: string; position: "left" | "center" | "right" }> = [
  { id: "riyadh", city: "Riyadh", detail: "Saudi Arabia", position: "left" },
  { id: "jeddah", city: "Jeddah", detail: "Saudi Arabia", position: "center" },
  { id: "alula", city: "AlUla", detail: "Saudi Arabia", position: "right" }
];

function getDestination(x: number): DestinationId {
  if (x < 0.34) return "riyadh";
  if (x < 0.67) return "jeddah";
  return "alula";
}

export function HeroExperience() {
  const [activeDestination, setActiveDestination] = useState<DestinationId | null>(null);
  const [airplaneActive, setAirplaneActive] = useState(false);
  const frame = useRef<number | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<DestinationId | null>(null);
  const airplaneRef = useRef(false);
  const reduceMotionRef = useRef(false);

  const clearScene = useCallback(() => {
    activeRef.current = null;
    airplaneRef.current = false;
    setActiveDestination(null);
    setAirplaneActive(false);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      reduceMotionRef.current = mediaQuery.matches;
      if (mediaQuery.matches) clearScene();
    };
    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => {
      mediaQuery.removeEventListener("change", syncMotionPreference);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [clearScene]);

  const updateScene = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reduceMotionRef.current) return;
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    const isBookingUi = (event.target as HTMLElement).closest(".booking-widget");
    const nextDestination = isBookingUi ? null : getDestination(x);
    const shouldFly = !isBookingUi && y < 0.3;
    if (activeRef.current !== nextDestination) {
      activeRef.current = nextDestination;
      setActiveDestination(nextDestination);
    }
    if (airplaneRef.current !== shouldFly) {
      airplaneRef.current = shouldFly;
      setAirplaneActive(shouldFly);
    }
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--hero-parallax-x", `${(x - 0.5) * -18}px`);
      target.style.setProperty("--hero-parallax-y", `${(y - 0.5) * -12}px`);
      target.style.setProperty("--hero-card-tilt-x", `${(y - 0.5) * -5}deg`);
      target.style.setProperty("--hero-card-tilt-y", `${(x - 0.5) * 7}deg`);
    });
  }, []);

  const toggleDestination = (id: DestinationId) => {
    const next = activeRef.current === id ? null : id;
    activeRef.current = next;
    setActiveDestination(next);
  };

  return (
    <div ref={sceneRef} className={`hero-experience${activeDestination ? " hero-experience--destination-active" : ""}${airplaneActive ? " hero-experience--airplane-active" : ""}`} aria-label="Interactive destinations" onPointerMove={updateScene} onPointerLeave={clearScene}>
      <ResponsivePicture baseName="hero" widths={[640, 960, 1440, 1920]} className="hero__poster" width={3000} height={1687} sizes="100vw" loading="eager" fetchPriority="high" alt="" />
      <HeroModel interactionRoot={sceneRef} />
      <div className="hero__wash" aria-hidden="true" />
      <div className="hero-experience__map" aria-hidden="true"><div className="hero-experience__trail" /><div className="hero-experience__airplane"><Image src={assetPath("/assets/route-plane.svg")} width={54} height={54} alt="" priority /></div></div>
      {destinations.map((destination) => {
        const isActive = activeDestination === destination.id;
        return <div className={`destination destination--${destination.position}${isActive ? " destination--active" : ""}`} key={destination.id}>
          <button className="destination__marker" type="button" aria-expanded={isActive} aria-controls={`destination-card-${destination.id}`} aria-label={`Show ${destination.city} destination`} onClick={() => toggleDestination(destination.id)}><span className="destination__pulse" /><span className="destination__pin" /></button>
          <article className="destination-card" id={`destination-card-${destination.id}`} aria-hidden={!isActive}><div className="destination-card__image"><Image src={assetPath("/assets/hero-640.avif")} width={320} height={160} alt="" /></div><div className="destination-card__copy"><span>{destination.detail}</span><strong>{destination.city}</strong></div></article>
        </div>;
      })}
    </div>
  );
}
