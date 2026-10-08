import { readFile } from "node:fs/promises";
import { posix } from "node:path";
import sharp from "sharp";

// Remove only the black video padding. Preserve the actual project photographs.
const photos = {
  "terrasse-motif-travertin": { top: 707, height: 507 },
  "terrasse-beton-imprime": { top: 383, height: 259 },
  "plage-piscine-travertin": { top: 656, height: 608 },
  "allee-beton-imprime": { top: 296, height: 433 },
  // These gallery crops match the center already shown by object-fit: cover.
  "beton-desactive-aix": { top: 622, height: 675 },
  "mise-en-oeuvre": { left: 96, width: 1728, top: 0, height: 1080 },
};

export function projectImages() {
  const images = new Map();
  let base;
  let assetUrl;
  return {
    name: "responsive-project-images",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    async buildStart() {
      images.clear();
      assetUrl = reference => `${base}${this.getFileName(reference)}`;
      for (const [name, crop] of Object.entries(photos)) {
        const original = await readFile(new URL(`../public/images/projets/${name}.webp`, import.meta.url));
        const metadata = await sharp(original).metadata();
        const width = crop?.width ?? metadata.width;
        const height = crop?.height ?? metadata.height;
        const widths = [...new Set([400, 640, 720, 960, Math.min(width, 1280)].filter(size => size <= width))].sort((a, b) => a - b);
        const formats = {};
        for (const format of ["avif", "webp"]) {
          formats[format] = [];
          for (const size of widths) {
            let image = sharp(original);
            if (crop) image = image.extract({ left: 0, width, ...crop });
            const source = await image.resize({ width: size, withoutEnlargement: true })
              .toFormat(format, format === "avif" ? { quality: 50, effort: 5 } : { quality: 76, effort: 5 })
              .toBuffer();
            const reference = this.emitFile({ type: "asset", name: `${name}-${size}.${format}`, source });
            formats[format].push({ size, reference });
          }
        }
        const mobile = {};
        if (name === "terrasse-motif-travertin") {
          // Phones already show only the center of this landscape photograph.
          // Encode that visible region at its native resolution, without upscaling.
          const mobileWidth = Math.round(height / 2);
          for (const format of ["avif", "webp"]) {
            const source = await sharp(original)
              .extract({ left: Math.floor((width - mobileWidth) / 2), top: crop.top, width: mobileWidth, height })
              .toFormat(format, format === "avif" ? { quality: 50, effort: 5 } : { quality: 76, effort: 5 })
              .toBuffer();
            mobile[format] = this.emitFile({ type: "asset", name: `${name}-mobile.${format}`, source });
          }
        }
        images.set(name, { width, height, formats, mobile });
      }
    },
    transformIndexHtml: {
      order: "post",
      handler(html, { bundle }) {
        if (!bundle) return html;
        return html.replace(/<img\b[^>]*\bsrc="[^"]*\/images\/projets\/([^"/]+)\.webp"[^>]*>/g, (tag, name) => {
          const photo = images.get(name);
          if (!photo) throw new Error(`No optimized photograph for ${name}`);
          const hero = tag.includes('fetchpriority="high"');
          // Lazy images can use their actual layout width in modern browsers.
          // Retain approximate grid sizes as a fallback for older browsers.
          const sizes = hero ? "100vw" : "auto, (max-width: 480px) calc(100vw - 38px), (max-width: 800px) calc((100vw - 64px) / 2), (max-width: 1150px) calc((100vw - 130px) / 3), (max-width: 1424px) calc((100vw - 162px) / 3), 421px";
          const srcset = format => photo.formats[format].map(({ size, reference }) => `${assetUrl(reference)} ${size}w`).join(", ");
          const fallback = assetUrl(photo.formats.webp[0].reference);
          const img = tag.replace(/\bsrc="[^"]+"/, `src="${fallback}" srcset="${srcset("webp")}" sizes="${sizes}"`)
            .replace(/\bwidth="\d+"/, `width="${photo.width}"`)
            .replace(/\bheight="\d+"/, `height="${photo.height}"`);
          const mobile = hero ? ["avif", "webp"].map(format => `<source media="(max-width: 480px)" type="image/${format}" srcset="${assetUrl(photo.mobile[format])}">`).join("") : "";
          return `<picture>${mobile}<source type="image/avif" srcset="${srcset("avif")}" sizes="${sizes}">${img}</picture>`;
        });
      },
    },
  };
}

// The entire minified stylesheet is small. Inline it to render immediately,
// without async-style flashes or JavaScript-dependent styling.
export function inlineStyles() {
  let base;
  return {
    name: "inline-small-stylesheets",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(html, { bundle }) {
        return html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (tag, href) => {
          const filename = href.slice(base.length);
          const asset = bundle?.[filename];
          if (!asset || asset.type !== "asset") throw new Error(`Missing stylesheet ${href}`);
          const css = String(asset.source).replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (original, quote, url) => {
            if (/^(?:data:|https?:|\/|#)/.test(url)) return original;
            return `url(${quote}${base}${posix.join(posix.dirname(filename), url)}${quote})`;
          });
          return `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`;
        });
      },
    },
  };
}
