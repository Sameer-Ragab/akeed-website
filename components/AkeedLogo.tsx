import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

type AkeedLogoProps = {
  tone?: "blue" | "ink";
};

export function AkeedLogo({ tone = "blue" }: AkeedLogoProps) {
  return (
    <span className={`brand brand--${tone}`} aria-label="Akeed">
      <span className="brand__mark" aria-hidden="true">
        <Image src={assetPath("/assets/logo-mark-top.svg")} width={26} height={17} alt="" />
        <Image src={assetPath("/assets/logo-mark-bottom.svg")} width={26} height={8} alt="" />
      </span>
      <span className="brand__word">Akeed</span>
    </span>
  );
}
