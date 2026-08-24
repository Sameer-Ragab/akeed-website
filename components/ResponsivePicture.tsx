import type { ComponentProps } from "react";
import { assetPath } from "@/lib/asset-path";

type ResponsivePictureProps = Omit<ComponentProps<"img">, "src" | "srcSet"> & {
  baseName: string;
  widths: readonly number[];
};

function buildSrcSet(baseName: string, widths: readonly number[], format: "avif" | "webp") {
  return widths
    .map((width) => `${assetPath(`/assets/${baseName}-${width}.${format}`)} ${width}w`)
    .join(", ");
}

export function ResponsivePicture({ baseName, widths, sizes = "100vw", alt = "", ...imageProps }: ResponsivePictureProps) {
  const largestWidth = widths.at(-1) ?? widths[0];

  return (
    <picture className="responsive-picture">
      <source type="image/avif" srcSet={buildSrcSet(baseName, widths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(baseName, widths, "webp")} sizes={sizes} />
      <img
        {...imageProps}
        src={assetPath(`/assets/${baseName}-${largestWidth}.webp`)}
        sizes={sizes}
        alt={alt}
        decoding="async"
      />
    </picture>
  );
}
