"use client"

import { useId } from "react"

interface DeviceShowcaseProps {
  /** Base path without suffix, e.g. "/images/pujolwilkie-scroll-desktop" -
   *  expects matching -1x.webp / -2x.webp / -3x.webp files to exist. */
  desktopImageBase: string
  mobileImageBase: string
  alt: string
}

/**
 * Shows one real client site scrolling live inside a monitor + phone frame,
 * both animating in sync (same keyframe/duration from globals.css).
 *
 * Images are served via CSS image-set() so each screen gets the resolution
 * tier matching its actual pixel density (1x/2x/3x) instead of one fixed
 * file for everyone - this is what keeps it sharp on retina displays
 * without serving an oversized file to standard-density screens. Falls
 * back to the 2x file on browsers that don't support image-set().
 *
 * Sizing uses em units throughout, scaled by the responsive font-size on
 * the outer wrapper (clamp-based, capped higher on large screens so the
 * showcase grows a bit more on big desktop monitors).
 */
export function DeviceShowcase({ desktopImageBase, mobileImageBase, alt }: DeviceShowcaseProps) {
  const uid = useId().replace(/[:]/g, "")

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{
        fontSize: "clamp(9px, 1.5vw + 4.5px, 19px)",
        height: "22.5em",
      }}
    >
      <style>{`
        .device-screen-desktop-${uid} {
          background-image: url('${desktopImageBase}-2x.webp');
          background-image: -webkit-image-set(
            url('${desktopImageBase}-1x.webp') 1x,
            url('${desktopImageBase}-2x.webp') 2x,
            url('${desktopImageBase}-3x.webp') 3x
          );
          background-image: image-set(
            url('${desktopImageBase}-1x.webp') 1x,
            url('${desktopImageBase}-2x.webp') 2x,
            url('${desktopImageBase}-3x.webp') 3x
          );
        }
        .device-screen-mobile-${uid} {
          background-image: url('${mobileImageBase}-2x.webp');
          background-image: -webkit-image-set(
            url('${mobileImageBase}-1x.webp') 1x,
            url('${mobileImageBase}-2x.webp') 2x,
            url('${mobileImageBase}-3x.webp') 3x
          );
          background-image: image-set(
            url('${mobileImageBase}-1x.webp') 1x,
            url('${mobileImageBase}-2x.webp') 2x,
            url('${mobileImageBase}-3x.webp') 3x
          );
        }
      `}</style>

      {/* soft glow behind the cluster */}
      <div
        className="absolute inset-0 rounded-[1.5em] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="relative" style={{ width: "26.25em", height: "22.5em" }}>
        {/* Monitor */}
        <div className="absolute z-[1]" style={{ left: "1.25em", top: 0, width: "21.25em" }}>
          <div
            className="rounded-[0.625em]"
            style={{
              background: "#14171d",
              padding: "0.6875em 0.6875em 0.9375em",
              boxShadow: "0 2.1875em 5em -1.5625em rgba(0,0,0,0.55), 0 0 0 0.0625em rgba(255,255,255,0.16)",
            }}
          >
            <div
              className="rounded-full mx-auto"
              style={{ width: "0.25em", height: "0.25em", background: "#2a2f3a", marginBottom: "0.4375em" }}
            />
            <div className="overflow-hidden" style={{ borderRadius: "0.125em", background: "#0b0d11" }}>
              <div className="flex" style={{ gap: "0.3em", padding: "0.28em 0.4em", background: "#1a1e26" }}>
                <span className="rounded-full" style={{ width: "0.375em", height: "0.375em", background: "#3a4150" }} />
                <span className="rounded-full" style={{ width: "0.375em", height: "0.375em", background: "#3a4150" }} />
                <span className="rounded-full" style={{ width: "0.375em", height: "0.375em", background: "#3a4150" }} />
              </div>
              <div className="relative overflow-hidden" style={{ height: "11.25em" }}>
                <div
                  className={`device-scroll-content device-screen-desktop-${uid} w-full h-full`}
                  style={{
                    backgroundSize: "100% auto",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                  }}
                  role="img"
                  aria-label={`${alt} - desktop`}
                />
              </div>
            </div>
          </div>
          <div
            className="mx-auto"
            style={{
              width: "1em",
              height: "1.625em",
              background: "linear-gradient(#1c2028,#14171d)",
              clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0% 100%)",
            }}
          />
          <div
            className="mx-auto rounded-[0.3125em]"
            style={{
              width: "6.875em",
              height: "0.5625em",
              background: "#14171d",
              boxShadow: "0 0.5em 1em -0.375em rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* Phone - overlapping the monitor's bottom-left, tilted */}
        <div
          className="absolute z-[3] rounded-[1.375em]"
          style={{
            left: "-1em",
            bottom: "-0.375em",
            width: "6em",
            transform: "rotate(6deg)",
            background: "#0f1116",
            padding: "0.4375em",
            boxShadow: "0 1.875em 4.0625em -1.125em rgba(0,0,0,0.6), 0 0 0 0.0625em rgba(255,255,255,0.2)",
          }}
        >
          {/* notch */}
          <div
            className="absolute rounded-[0.375em] z-[4]"
            style={{
              top: "0.75em",
              left: "50%",
              transform: "translateX(-50%)",
              width: "2.125em",
              height: "0.5em",
              background: "#000",
            }}
          />
          {/* side button */}
          <div
            className="absolute rounded-[0.125em]"
            style={{ top: "3.75em", right: "-0.125em", width: "0.125em", height: "1.75em", background: "#1c2028" }}
          />
          <div className="overflow-hidden" style={{ borderRadius: "1em", height: "12.875em" }}>
            <div
              className={`device-scroll-content device-screen-mobile-${uid} w-full h-full`}
              style={{
                backgroundSize: "100% auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top center",
              }}
              role="img"
              aria-label={`${alt} - mobile`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
