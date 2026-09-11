
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    text: "Built to Last",
    accent: "#E8B04B",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    text: "On Orders Over $99",
    accent: "#4FC3A1",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    text: "30-Day Hassle Free",
    accent: "#E0708A",
  },
  {
    icon: Headset,
    title: "Expert Support",
    text: "We're Here to Help",
    accent: "#5BA8E0",
  },
];

export default function Hero() {
  const [rpm, setRpm] = useState(3.2);

  /* ============================================================
     SMOOTH AUTOMATIC RPM ANIMATION
  ============================================================ */

  useEffect(() => {
    const startTime = performance.now();

    const minRPM = 1.2;
    const maxRPM = 6.8;
    const duration = 4000;

    const updateRPM = () => {
      const elapsed = (performance.now() - startTime) % (duration * 2);

      let progress;

      if (elapsed <= duration) {
        progress = elapsed / duration;
      } else {
        progress = 2 - elapsed / duration;
      }

      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentRPM =
        minRPM + (maxRPM - minRPM) * eased;

      setRpm(currentRPM);
    };

    const interval = window.setInterval(updateRPM, 100);
    updateRPM();

    return () => window.clearInterval(interval);
  }, []);

  /* ============================================================
     RPM NEEDLE ANGLE
  ============================================================ */

  const needleAngle = -120 + (rpm / 8) * 240;

  return (
    <>
      {/* =========================================================
          HERO SECTION — 100VH
      ========================================================= */}

      <section
        id="home"
        className="
          relative
          min-h-[100svh]
          overflow-hidden
          bg-[#15161A]
          text-[#FBFAF7]
        "
      >
        {/* =====================================================
            BACKGROUND GLOW
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(ellipse_900px_500px_at_78%_20%,rgba(226,35,26,.18),transparent_60%)]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            top-10
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#E2231A]/5
            blur-[120px]
            animate-pulse
          "
        />

        {/* =====================================================
            GRID BACKGROUND
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-20
            bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)]
            bg-[size:48px_48px]
          "
        />

        {/* =====================================================
            CONTENT — 100VH
        ===================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            min-h-[100svh]
            max-w-[1320px]
            grid-cols-1
            items-center
            gap-10
            px-5
            pt-24
            pb-10
            sm:px-8
            sm:pt-28
            sm:pb-12
            lg:grid-cols-[1.05fr_.95fr]
            lg:gap-12
            lg:px-8
            lg:py-20
          "
        >
          {/* ===================================================
              LEFT CONTENT
          =================================================== */}

          <div className="relative z-20 w-full">

            {/* HEADING */}

            <h1
              className="
                font-display
                text-[44px]
                font-bold
                uppercase
                leading-[.95]
                tracking-tight
                sm:text-6xl
                md:text-7xl
                lg:text-[82px]
              "
            >
              Drive better.
              <br />

              Drive{" "}

              <span
                className="
                  relative
                  inline-block
                  text-white
                "
              >
                further.

                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    h-[4px]
                    w-full
                    origin-left
                    animate-line
                    bg-[#E2231A]
                  "
                />
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-7
                max-w-xl
                animate-fade-up
                text-sm
                leading-relaxed
                text-[#C9CDD3]
                opacity-0
                sm:text-lg
              "
              style={{
                animationDelay: ".18s",
                animationFillMode: "forwards",
              }}
            >
              High-quality automotive parts for every make and model —
              sourced from the brands mechanics actually trust.
            </p>

            {/* =================================================
                CTA BUTTONS
            ================================================= */}

            <div
              className="
                mt-8
                flex
                animate-fade-up
                flex-col
                gap-3
                opacity-0
                sm:flex-row
                sm:flex-wrap
                sm:gap-4
              "
              style={{
                animationDelay: ".3s",
                animationFillMode: "forwards",
              }}
            >

              {/* =================================================
                  SHOP PRODUCTS → /products
              ================================================= */}

              <Link
                to="/products"
                className="
                  group
                  relative
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  rounded-md
                  bg-[#E2231A]
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#c91e17]
                  hover:shadow-lg
                  hover:shadow-red-900/30
                  sm:w-auto
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    bg-white/10
                    transition-transform
                    duration-500
                    group-hover:translate-x-0
                  "
                />

                <span className="relative">
                  Shop Products
                </span>

                <span
                  className="
                    relative
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>

              {/* =================================================
                  BROWSE CATEGORIES → /categories
              ================================================= */}

              <Link
                to="/products"
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#C9CDD3]
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-white/20
                  hover:bg-white/[0.07]
                  hover:text-white
                  sm:w-auto
                "
              >
                Browse Categories

                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>

            </div>

            {/* =================================================
                SMALL STATS
            ================================================= */}

            <div
              className="
                mt-10
                flex
                animate-fade-up
                flex-wrap
                gap-5
                opacity-0
                sm:gap-8
              "
              style={{
                animationDelay: ".42s",
                animationFillMode: "forwards",
              }}
            >

              {/* PRODUCTS */}

              <div>
                <div
                  className="
                    font-display
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  10K+
                </div>

                <div
                  className="
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-[#8B92A0]
                  "
                >
                  Products
                </div>
              </div>

              <div
                className="
                  hidden
                  h-10
                  w-px
                  bg-white/10
                  sm:block
                "
              />

              {/* BRANDS */}

              <div>
                <div
                  className="
                    font-display
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  500+
                </div>

                <div
                  className="
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-[#8B92A0]
                  "
                >
                  Brands
                </div>
              </div>

              <div
                className="
                  hidden
                  h-10
                  w-px
                  bg-white/10
                  sm:block
                "
              />

              {/* SUPPORT */}

              <div>
                <div
                  className="
                    font-display
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  24/7
                </div>

                <div
                  className="
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-[#8B92A0]
                  "
                >
                  Support
                </div>
              </div>

            </div>
          </div>

          {/* ===================================================
              RIGHT RPM GAUGE
          =================================================== */}

          <div
            className="
              relative
              hidden
              h-[520px]
              lg:block
            "
          >

            {/* GAUGE GLOW */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[390px]
                w-[390px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#E2231A]/10
                blur-[80px]
                animate-pulse
              "
            />

            {/* =================================================
                GAUGE
            ================================================= */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[420px]
                w-[420px]
                -translate-x-1/2
                -translate-y-1/2
              "
            >
              <svg
                viewBox="0 0 420 420"
                className="h-full w-full"
              >

                {/* OUTER RING */}

                <circle
                  cx="210"
                  cy="210"
                  r="188"
                  fill="none"
                  stroke="rgba(255,255,255,.08)"
                  strokeWidth="2"
                />

                {/* INNER RING */}

                <circle
                  cx="210"
                  cy="210"
                  r="160"
                  fill="rgba(255,255,255,.03)"
                  stroke="rgba(255,255,255,.1)"
                />

                {/* INNER GLOW */}

                <circle
                  cx="210"
                  cy="210"
                  r="135"
                  fill="none"
                  stroke="rgba(226,35,26,.08)"
                  strokeWidth="1"
                />

                {/* NORMAL TICKS */}

                <g
                  stroke="rgba(255,255,255,.35)"
                  strokeWidth="2"
                >
                  {[
                    -120,
                    -90,
                    -60,
                    -30,
                    0,
                    30,
                    60,
                    90,
                    120,
                  ].map((angle) => (
                    <line
                      key={angle}
                      x1="210"
                      y1="60"
                      x2="210"
                      y2="76"
                      transform={`rotate(${angle} 210 210)`}
                    />
                  ))}
                </g>

                {/* WARNING TICKS */}

                <g
                  stroke="#E2231A"
                  strokeWidth="4"
                >
                  <line
                    x1="210"
                    y1="55"
                    x2="210"
                    y2="76"
                    transform="rotate(120 210 210)"
                  />

                  <line
                    x1="210"
                    y1="55"
                    x2="210"
                    y2="76"
                    transform="rotate(150 210 210)"
                  />
                </g>

                {/* RPM LABEL */}

                <text
                  x="210"
                  y="150"
                  textAnchor="middle"
                  fill="#8B92A0"
                  fontSize="12"
                  letterSpacing="2"
                >
                  ×1000 RPM
                </text>

                {/* RPM NEEDLE */}

                <line
                  x1="210"
                  y1="210"
                  x2="210"
                  y2="90"
                  stroke="#F2A93B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: "210px 210px",
                    transform: `rotate(${needleAngle}deg)`,
                    transition: "transform 80ms linear",
                  }}
                />

                {/* NEEDLE GLOW */}

                <line
                  x1="210"
                  y1="210"
                  x2="210"
                  y2="90"
                  stroke="#F2A93B"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.3"
                  style={{
                    transformOrigin: "210px 210px",
                    transform: `rotate(${needleAngle}deg)`,
                    transition: "transform 80ms linear",
                    filter: "blur(3px)",
                  }}
                />

                {/* CENTER */}

                <circle
                  cx="210"
                  cy="210"
                  r="11"
                  fill="#F2A93B"
                />

                <circle
                  cx="210"
                  cy="210"
                  r="5"
                  fill="#15161A"
                />

                {/* LIVE RPM */}

                <text
                  x="210"
                  y="250"
                  textAnchor="middle"
                  fill="#FBFAF7"
                  fontSize="30"
                  fontWeight="600"
                >
                  {rpm.toFixed(1)}
                </text>

                <text
                  x="210"
                  y="272"
                  textAnchor="middle"
                  fill="#8B92A0"
                  fontSize="10"
                  letterSpacing="3"
                >
                  OPTIMAL RANGE
                </text>

              </svg>
            </div>

            {/* =================================================
                FLOATING SHIELD
            ================================================= */}

            <div
              className="
                absolute
                right-0
                top-8
                animate-float
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-4
                  backdrop-blur-sm
                "
              >
                <ShieldCheck
                  size={65}
                  strokeWidth={1}
                  className="text-[#C9CDD3]"
                />
              </div>
            </div>

            {/* =================================================
                FLOATING ZAP
            ================================================= */}

            <div
              className="
                absolute
                bottom-20
                right-20
                animate-float
              "
              style={{
                animationDelay: ".5s",
              }}
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-[#F2A93B]/20
                  bg-[#F2A93B]/5
                  p-4
                  backdrop-blur-sm
                "
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  className="text-[#F2A93B]"
                >
                  <path
                    d="M34 4L14 34H28L24 56L46 24H32L34 4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* =================================================
                FLOATING CIRCLE
            ================================================= */}

            <div
              className="
                absolute
                right-8
                top-1/2
                animate-float
              "
              style={{
                animationDelay: "1s",
              }}
            >
              <div
                className="
                  h-16
                  w-16
                  rounded-full
                  border
                  border-[#C9CDD3]/30
                  bg-white/[0.02]
                  backdrop-blur-sm
                "
              />
            </div>

            {/* DECORATIVE DOT */}

            <div
              className="
                absolute
                left-10
                top-20
                h-2
                w-2
                animate-ping
                rounded-full
                bg-[#E2231A]
              "
            />

            <div
              className="
                absolute
                bottom-10
                left-20
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-[#F2A93B]
              "
            />

          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST / FEATURE BAR
      ========================================================= */}

      <FeatureBar />
    </>
  );
}

/* =============================================================
   FEATURE BAR
============================================================= */

function FeatureBar() {
  return (
    <section className="bg-[#1D1F26]">
      <div
        className="
          mx-auto
          grid
          max-w-[1320px]
          grid-cols-2
          lg:grid-cols-4
        "
      >
        {FEATURES.map(
          (
            {
              icon: Icon,
              title,
              text,
              accent,
            },
            index
          ) => (
            <div
              key={title}
              className="
                group
                relative
                overflow-hidden
                border-b
                border-r
                border-white/5
                px-4
                py-6
                transition-all
                duration-500
                hover:bg-white/[0.02]
                sm:px-5
                sm:py-7
              "
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -top-10
                  left-1/2
                  h-32
                  w-32
                  -translate-x-1/2
                  rounded-full
                  opacity-0
                  blur-2xl
                  transition-opacity
                  duration-500
                  group-hover:opacity-25
                "
                style={{
                  background: accent,
                }}
              />

              {/* ICON */}

              <div
                className="
                  relative
                  mb-4
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  transition-all
                  duration-500
                  ease-out
                  group-hover:-translate-y-1
                  group-hover:rotate-6
                  group-hover:scale-110
                  group-hover:rounded-[14px]
                "
              >
                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:rounded-[14px]
                    group-hover:opacity-100
                  "
                  style={{
                    boxShadow: `
                      0 0 0 1px ${accent}55,
                      0 8px 20px -6px ${accent}88
                    `,
                  }}
                />

                <Icon
                  className="
                    relative
                    h-5
                    w-5
                    text-[#8B92A0]
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:text-white
                  "
                  strokeWidth={1.75}
                />
              </div>

              {/* TITLE */}

              <div
                className="
                  relative
                  font-display
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  sm:text-sm
                "
              >
                {title}
              </div>

              {/* DESCRIPTION */}

              <div
                className="
                  relative
                  mt-1
                  text-[10px]
                  text-[#8B92A0]
                  transition-colors
                  duration-300
                  group-hover:text-[#B5BAC4]
                  sm:text-xs
                "
              >
                {text}
              </div>

              {/* BOTTOM ACCENT */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-full
                  origin-left
                  scale-x-0
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-x-100
                "
                style={{
                  background: `linear-gradient(
                    90deg,
                    ${accent},
                    transparent
                  )`,
                }}
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}

