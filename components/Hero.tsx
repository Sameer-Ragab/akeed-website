"use client";

import Image from "next/image";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";

const services = [
  { label: "Flight", icon: "/assets/tab-flight.svg" },
  { label: "Hotel", icon: "/assets/tab-hotel.svg" },
  { label: "Car Rental", icon: "/assets/tab-car.svg" },
  { label: "More", icon: "/assets/tab-more.svg" }
] as const;

const travelClasses = ["Economy", "Business", "First"] as const;
const purposes = ["Personal", "Business"] as const;
type ServiceLabel = (typeof services)[number]["label"];

export function Hero() {
  const [activeService, setActiveService] = useState<ServiceLabel>("Flight");
  const [routeCount, setRouteCount] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const [purpose, setPurpose] = useState<(typeof purposes)[number]>("Personal");
  const [travelClass, setTravelClass] = useState<(typeof travelClasses)[number]>("Economy");
  const [day, setDay] = useState(24);
  const [swapped, setSwapped] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const storedService = window.localStorage.getItem("akeed-active-service") as ServiceLabel | null;
    if (services.some((service) => service.label === storedService)) setActiveService(storedService!);
  }, []);

  const selectService = (service: ServiceLabel) => {
    setActiveService(service);
    window.localStorage.setItem("akeed-active-service", service);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = services.length - 1;
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    else if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    selectService(services[nextIndex].label);
    tabRefs.current[nextIndex]?.focus();
  };

  const cycleClass = () => {
    const index = travelClasses.indexOf(travelClass);
    setTravelClass(travelClasses[(index + 1) % travelClasses.length]);
  };

  const cyclePurpose = () => {
    const index = purposes.indexOf(purpose);
    setPurpose(purposes[(index + 1) % purposes.length]);
  };

  return (
    <section className={`hero${routeCount > 1 ? " hero--expanded" : ""}`} aria-label="Book business travel">
      <Image className="hero__background" src={assetPath("/assets/hero-layer-3.png")} fill priority sizes="100vw" alt="" quality={100} />
      <div className="hero__wash" aria-hidden="true" />
      <h1 className="sr-only">Book business travel with Akeed</h1>

      <div className="hero__content page-shell">
        <div className="booking-widget">
          <div className="service-tabs" role="tablist" aria-label="Travel service" data-reveal="hero-tabs">
            {services.map((service, index) => {
              const isActive = activeService === service.label;
              return (
                <button
                  key={service.label}
                  ref={(element) => { tabRefs.current[index] = element; }}
                  id={`service-tab-${index}`}
                  className={`service-tab${isActive ? " service-tab--active" : ""}`}
                  type="button"
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-controls="travel-search-panel"
                  aria-selected={isActive}
                  onClick={() => selectService(service.label)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <Image src={assetPath(service.icon)} width={24} height={24} alt="" />
                  <span>{service.label}</span>
                </button>
              );
            })}
          </div>

          <form
            id="travel-search-panel"
            className="flight-search"
            data-reveal="hero-card"
            role="tabpanel"
            aria-labelledby={`service-tab-${services.findIndex((service) => service.label === activeService)}`}
            action="https://flyakeed.com/"
            method="get"
            target="_blank"
          >
            <input type="hidden" name="service" value={activeService} />
            <input type="hidden" name="from" value={swapped ? "SFO" : "RUH"} />
            <input type="hidden" name="to" value={swapped ? "RUH" : "SFO"} />
            <input type="hidden" name="date" value={`${day} Oct`} />
            <input type="hidden" name="class" value={travelClass} />
            <input type="hidden" name="travelers" value={travelers} />
            <input type="hidden" name="purpose" value={purpose} />

            {routeCount === 0 ? (
              <div className="flight-search__empty" role="status">
                <button className="add-city" type="button" onClick={() => setRouteCount(1)}>
                  <Image src={assetPath("/assets/location.svg")} width={16} height={16} alt="" />
                  Add City
                </button>
              </div>
            ) : (
              Array.from({ length: routeCount }, (_, index) => (
                <div className="flight-search__top" key={index}>
                  <span className="route-index" aria-label={`Route ${index + 1}`}>{index + 1}</span>
                  <button className="airport-pill" type="button" aria-label="Swap origin and destination" onClick={() => setSwapped((value) => !value)}>
                    <span className="flag" aria-hidden="true"><Image src={assetPath(swapped ? "/assets/flag-us.svg" : "/assets/flag-sa.svg")} width={20} height={20} alt="" /></span>
                    <span><strong>{swapped ? "SFO" : "RUH"}</strong><small>{swapped ? "San fran. USA" : "Riyadh, KSA"}</small></span>
                  </button>
                  <span className="route-line" aria-hidden="true">
                    <Image className="route-line__dash" src={assetPath("/assets/plane-route.svg")} width={76} height={2} alt="" />
                    <Image className="route-line__plane" src={assetPath("/assets/route-plane.svg")} width={20} height={20} alt="" />
                  </span>
                  <button className="airport-pill" type="button" aria-label="Swap origin and destination" onClick={() => setSwapped((value) => !value)}>
                    <span className="flag" aria-hidden="true"><Image src={assetPath(swapped ? "/assets/flag-sa.svg" : "/assets/flag-us.svg")} width={20} height={20} alt="" /></span>
                    <span><strong>{swapped ? "RUH" : "SFO"}</strong><small>{swapped ? "Riyadh, KSA" : "San fran. USA"}</small></span>
                  </button>
                  <button className="search-value search-value--date" type="button" aria-label={`Departure date ${day} October. Change date`} onClick={() => setDay((value) => value === 28 ? 24 : value + 1)}>
                    <strong>{day}</strong><small>Oct</small>
                  </button>
                  <button className="search-value search-value--class" type="button" aria-label={`${travelClass}. Change travel class`} onClick={cycleClass}>
                    <strong>{travelClass}</strong><small>Class {travelClass === "Economy" ? "Y" : travelClass === "Business" ? "C" : "F"}</small>
                  </button>
                  <button className="route-close" type="button" aria-label={`Remove route ${index + 1}`} onClick={() => setRouteCount((value) => Math.max(0, value - 1))}>×</button>
                </div>
              ))
            )}

            <div className="flight-search__bottom">
              <button className="add-city" type="button" disabled={routeCount >= 3} onClick={() => setRouteCount((value) => Math.min(3, value + 1))}>
                <Image src={assetPath("/assets/location.svg")} width={16} height={16} alt="" />
                Add City
              </button>
              <button className="compact-select" type="button" aria-label={`${travelers} travelers. Change number of travelers`} onClick={() => setTravelers((value) => value === 4 ? 1 : value + 1)}><strong>{travelers}</strong><span>Travelers</span><i aria-hidden="true" /></button>
              <button className="compact-select" type="button" aria-label={`${purpose} purpose. Change trip purpose`} onClick={cyclePurpose}><strong>{purpose}</strong><span>Purpose</span><i aria-hidden="true" /></button>
              <button className="button button--primary search-button" type="submit" disabled={routeCount === 0}>Search</button>
            </div>
            <p className="sr-only" aria-live="polite">{activeService} selected. {routeCount} route selected.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
