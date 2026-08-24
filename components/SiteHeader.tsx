"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { AkeedLogo } from "./AkeedLogo";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    const updateHeader = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 0);
      });
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  return (
    <header className={`site-header page-shell${isScrolled ? " site-header--scrolled" : ""}`}>
      <a href="https://flyakeed.com/" className="logo-link" aria-label="Akeed home">
        <AkeedLogo />
      </a>
      <div className="site-header__actions">
        <span className="language-flag" role="img" aria-label="Saudi Arabia">
          <Image src={assetPath("/assets/flag-sa.svg")} width={24} height={24} alt="" />
        </span>
        <a className="button button--primary button--small" href="https://corporate.flyakeed.com/">Login</a>
      </div>
    </header>
  );
}
