import React from "react";
import {
  ShieldCheck,
  Wrench,
  Truck,
  Users,
  Award,
  Target,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <section className="relative overflow-hidden bg-white px-6 py-20">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-600">
            About Our Company
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Your Trusted Partner for
            <span className="text-sky-600"> Automotive Parts</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            EZIN ZAHAN AUTO SPARE PARTS TRADING LLC supplies reliable replacement
            components and accessories to vehicle owners, workshops, and businesses
            in Dubai, UAE.
          </p>
        </div>

        {/* Decorative background effects */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["10+", "Years Experience"],
              ["5K+", "Auto Parts"],
              ["2K+", "Happy Customers"],
              ["50+", "Trusted Brands"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-xl bg-white p-6 text-center shadow-sm"
              >
                <h2 className="text-3xl font-bold text-sky-600">
                  {number}
                </h2>

                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Target className="mb-5 text-sky-600" size={36} />

              <h2 className="text-2xl font-bold text-slate-900">
                Our Mission
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                To make quality automotive parts accessible through trusted
                products, transparent pricing, modern technology, and
                dependable customer service.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Award className="mb-5 text-sky-600" size={36} />

              <h2 className="text-2xl font-bold text-slate-900">
                Our Vision
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                To build a smarter automotive marketplace where customers can
                easily discover, compare, and purchase the right parts for
                their vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}