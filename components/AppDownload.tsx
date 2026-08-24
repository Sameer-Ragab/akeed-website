import { assetPath } from "@/lib/asset-path";
import { ResponsivePicture } from "./ResponsivePicture";

export function AppDownload() {
  return (
    <section className="app-download" aria-labelledby="app-heading">
      <div className="app-download__blue-shape" aria-hidden="true" />
      <div className="app-download__white-shape" aria-hidden="true" />
      <div className="app-download__content page-shell">
        <div className="app-download__stores" data-reveal="stores">
          <h2 id="app-heading">Get the App</h2>
          <a href="https://apps.apple.com/sa/app/flyakeed/id988581688" target="_blank" rel="noreferrer" aria-label="Download on the App Store">
            <img src={assetPath("/assets/app-store.svg")} width={190} height={64} alt="Download on the App Store" loading="lazy" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.leandiv.flyakeed" target="_blank" rel="noreferrer" aria-label="Get it on Google Play">
            <img src={assetPath("/assets/google-play.svg")} width={190} height={56} alt="Get it on Google Play" loading="lazy" />
          </a>
        </div>
        <ResponsivePicture
          baseName="app-phones"
          widths={[640, 960, 1280, 1600]}
          className="app-download__phones"
          width={1785}
          height={1004}
          sizes="(max-width: 600px) 560px, (max-width: 900px) 780px, 861px"
          loading="lazy"
          alt="Akeed mobile app screens"
          data-reveal="phones"
        />
      </div>
    </section>
  );
}
