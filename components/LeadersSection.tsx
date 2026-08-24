import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

const leaders = [
  ["NEOM", "/assets/leader-neom.svg", 44, 42],
  ["Saudi Media Academy", "/assets/leader-sma.svg", 52, 42],
  ["STC", "/assets/leader-stc.svg", 63, 32],
  ["Nahdi", "/assets/leader-nahdi.svg", 45, 42],
  ["Saudi Arabian Football Federation", "/assets/leader-saff.svg", 43, 42],
  ["Ministry of Industry and Mineral Resources", "/assets/leader-ministry.svg", 43, 42],
  ["KAPSARC", "/assets/leader-kapsarc.svg", 76, 42],
  ["Elm", "/assets/leader-elm.svg", 51, 42],
  ["Public Investment Fund", "/assets/leader-pif.svg", 42, 42]
] as const;

export function LeadersSection() {
  return (
    <section className="leaders">
      <div className="leaders__inner page-shell">
        <div className="leaders__line" aria-hidden="true" data-reveal="line" />
        <div className="leaders__logos" aria-label="Leading organizations using Akeed" data-reveal="logo-list">
          {leaders.map(([name, src, width, height]) => (
            <Image key={name} src={assetPath(src)} width={width} height={height} alt={name} unoptimized />
          ))}
        </div>
        <div className="leaders__copy" data-reveal="section-copy">
          <h2>Choice of The Leaders</h2>
          <p>Book, approve, and manage every trip from one platform.</p>
        </div>
        <a className="button button--mint" href="#features" data-reveal="action">Explore</a>
      </div>
    </section>
  );
}
