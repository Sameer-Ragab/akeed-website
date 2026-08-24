import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

const stats = [
  ["221+", "Enterprise Clients"],
  ["828", "Travel Managers"],
  ["39.7k", "Active Users"],
  ["1.4M+", "Travel Requests"],
  ["275.2k", "Air Tickets"],
  ["5,509", "Hotel Rooms"]
] as const;

const complianceMarks = [
  { src: "/assets/compliance-1.svg", registration: "#1010607759", alt: "Saudi commercial registration mark" },
  { src: "/assets/compliance-raw.png", registration: "#2445917561", alt: "Monsha’at registration mark" },
  { src: "/assets/compliance-2.svg", registration: "#73100202", alt: "Saudi business registration mark" },
  { src: "/assets/compliance-3.svg", registration: "#715108-55121598", alt: "Qiwa registration mark" },
  { src: "/assets/compliance-4.svg", registration: "#528088260", alt: "GOSI registration mark" },
  { src: "/assets/compliance-5.svg", registration: "#310172096700003", alt: "Saudi national registration mark" }
] as const;

export function FeatureShowcase() {
  return (
    <section className="showcase" id="features">
      <div className="page-shell showcase__inner">
        <h2 className="impact-title" data-reveal="impact-title">
          <span className="impact-title__lead">Our Big Step</span>
          <span className="impact-title__main">In Business Travel</span>
          <Image className="impact-title__underline" src={assetPath("/assets/impact-underline.svg")} width={434} height={32} alt="" unoptimized />
        </h2>

        <dl className="stats" data-reveal="stats-list">
          {stats.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>

        <div className="showcase__divider" aria-hidden="true" data-reveal="line" />
        <h2 className="showcase__title" data-reveal="section-copy">We’ll Get Your Team Flying</h2>

        <div className="feature-gallery">
          <div className="feature-row feature-row--policy">
            <article className="feature-card feature-card--cool feature-card--policy" data-reveal="feature-left">
              <div className="feature-copy feature-copy--policy">
                <h3>All Within<br />Your Policies</h3>
                <p>For Company &amp; Employees Travel Management Company &amp; Employees Travel Management Company &amp; Employees Travel Management</p>
              </div>
              <Image
                className="feature-dashboard"
                src={assetPath("/assets/feature-dashboard.png")}
                width={1207}
                height={1037}
                sizes="(max-width: 600px) calc(100vw - 68px), 489px"
                alt="AkeedPay corporate dashboard"
              />
            </article>

            <article className="feature-card feature-card--pink feature-card--approval" data-reveal="feature-right">
              <FeatureCopy title="With Approval flows" body="Set approval chains or Auto-approve rules" />
              <Image
                className="feature-phone feature-phone--approval"
                src={assetPath("/assets/feature-phone-approval.png")}
                width={180}
                height={293}
                sizes="180px"
                alt="Approval flow in the Akeed mobile app"
              />
            </article>
          </div>

          <div className="feature-row feature-row--finance">
            <div className="feature-stack feature-stack--budgets">
              <article className="feature-card feature-card--pink feature-card--dashboard-title" data-reveal="feature-left">
                <FeatureCopy title="Full Dashboard" body="Trips, Spendings and Ranks" />
              </article>
              <article className="feature-card feature-card--pink feature-card--budgets" data-reveal="feature-left">
                <FeatureCopy title="Travel Budgets" body="For Employees Trips and Purchases" />
                <FeatureCopy title="Traveler’s Per Diem" body="For Employees Trips and Purchases" />
              </article>
            </div>

            <article className="feature-card feature-card--cool feature-card--billing" data-reveal="feature-right">
              <Image
                className="feature-phone feature-phone--billing"
                src={assetPath("/assets/feature-phone-billing.png")}
                width={180}
                height={364}
                sizes="180px"
                alt="Detailed billing in the Akeed mobile app"
              />
              <div className="feature-billing-copy">
                <FeatureCopy title="Detailed Billing" body="Set approval chains or Auto-" />
                <FeatureCopy title="Redeemable VAT" body="Set approval chains or Auto-" />
                <FeatureCopy title="ZATCA Compliant" body="Set approval chains or Auto-" />
              </div>
            </article>
          </div>

          <div className="feature-row feature-row--services">
            <article className="feature-card feature-card--plain feature-card--services" data-reveal="feature-left">
              <div className="feature-services-copy">
                <h3>Your Airlines<br />Your Hotels<br />And Your Cars</h3>
                <span className="feature-services-divider" aria-hidden="true" />
                <div>
                  <h3 className="feature-services-subtitle">And All The<br />Extras You Need</h3>
                  <p>Paying your bills on AkeedPay has never been easier. Whether you are</p>
                </div>
              </div>
            </article>

            <div className="feature-stack feature-stack--services">
              <article className="feature-card feature-card--pink feature-card--erp" data-reveal="feature-right">
                <FeatureCopy title="ERP Integration" body="For Employees Trips and Purchases" />
                <FeatureCopy title="No More Paper Work" body="For Employees Trips and Purchases" />
              </article>
              <article className="feature-card feature-card--pink feature-card--secure" data-reveal="feature-right">
                <FeatureCopy title="Robust & Secure" body="For Employees Trips and Purchases" />
              </article>
            </div>
          </div>

          <article className="feature-card feature-card--plain feature-compliance" data-reveal="feature-up">
            <h3>Fully Saudi &amp; Compliant</h3>
            <ul className="feature-compliance__marks" data-reveal="logo-list">
              {complianceMarks.map((mark) => (
                <li key={mark.registration}>
                  <span className="feature-compliance__logo">
                    <Image src={assetPath(mark.src)} width={96} height={64} alt={mark.alt} unoptimized={mark.src.endsWith(".svg")} />
                  </span>
                  <span>{mark.registration}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function FeatureCopy({ title, body }: { title: string; body: string }) {
  return (
    <div className="feature-copy">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
