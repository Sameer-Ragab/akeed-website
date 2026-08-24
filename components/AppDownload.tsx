import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

export function AppDownload() {
  return (
    <section className="app-download" aria-labelledby="app-heading">
      <div className="app-download__blue-shape" aria-hidden="true" />
      <div className="app-download__white-shape" aria-hidden="true" />
      <div className="app-download__content page-shell">
        <div className="app-download__stores" data-reveal="stores">
          <h2 id="app-heading">Get the App</h2>
          <a href="https://apps.apple.com/sa/app/flyakeed/id988581688" target="_blank" rel="noreferrer" aria-label="Download on the App Store">
            <Image src={assetPath("/assets/app-store.svg")} width={190} height={64} alt="Download on the App Store" unoptimized />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.leandiv.flyakeed" target="_blank" rel="noreferrer" aria-label="Get it on Google Play">
            <Image src={assetPath("/assets/google-play.svg")} width={190} height={56} alt="Get it on Google Play" unoptimized />
          </a>
        </div>
        <Image className="app-download__phones" src={assetPath("/assets/app-phones.png")} width={850} height={628} sizes="(max-width: 800px) 95vw, 861px" alt="Akeed mobile app screens" quality={100} data-reveal="phones" />
      </div>
    </section>
  );
}
