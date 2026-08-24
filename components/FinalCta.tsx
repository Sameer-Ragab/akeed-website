import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { AkeedLogo } from "./AkeedLogo";

const footerLinks = [
  ["About us", "https://flyakeed.com/aboutus.html"],
  ["Corporate", "https://corporate.flyakeed.com/features"],
  ["Contact", "https://akeeder.com/contact.html"],
  ["FAQ", "https://akeeder.com/faqs.html"],
  ["Community", "https://akeed.flyakeed.com/flyakeed-community-referral-program"],
  ["T&C", "https://flyakeed.com/terms.html"],
  ["Privacy", "https://akeeder.com/privacy.html"]
] as const;
const socials = [
  ["LinkedIn", "/assets/linkedin.svg", "https://www.linkedin.com/company/flyakeed"],
  ["YouTube", "/assets/youtube.svg", "https://www.youtube.com/results?search_query=FlyAkeed"],
  ["Instagram", "/assets/instagram.svg", "https://www.instagram.com/flyakeed/"],
  ["Facebook", "/assets/facebook.svg", "https://www.facebook.com/FlyAkeed"],
  ["X", "/assets/x.svg", "https://x.com/FlyAkeed"]
] as const;

export function FinalCta() {
  return (
    <section className="final-cta" data-reveal="cta-surface">
      <Image className="final-cta__background" src={assetPath("/assets/cta-bg.png")} fill sizes="100vw" alt="" quality={100} />
      <div className="final-cta__wash" aria-hidden="true" />
      <div className="final-cta__content page-shell">
        <div className="final-cta__copy" data-reveal="section-copy">
          <h2>Start Your<br />Business Trips</h2>
          <p>From Request to Approval... all in one workflow</p>
        </div>
        <div className="round-actions" data-reveal="action-list">
          <a className="round-action round-action--blue" href="https://corporate.flyakeed.com/">
            <Image src={assetPath("/assets/rocket.svg")} width={36} height={36} alt="" />
            <strong>Join</strong><span>for Free</span>
          </a>
          <a className="round-action round-action--mint" href="https://muqeem.flyakeed.com/">
            <Image src={assetPath("/assets/calendar.svg")} width={36} height={36} alt="" />
            <strong>Book</strong><span>a Demo</span>
          </a>
        </div>
      </div>

      <footer className="footer page-shell" data-reveal="footer">
        <AkeedLogo tone="ink" />
        <nav className="footer__nav" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          <span>©2026 All rights reserved</span>
        </nav>
        <div className="footer__socials">
          {socials.map(([name, icon, href]) => (
            <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer">
              <Image src={assetPath(icon)} width={21} height={21} alt="" />
            </a>
          ))}
        </div>
      </footer>
    </section>
  );
}
