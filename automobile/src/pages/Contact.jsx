import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "971568706629";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Our Location",
    text: "P.O. Box No. 237590, Dubai, UAE",
  },
  {
    icon: Phone,
    title: "Call Us",
    text: "+971 56 870 6629",
  },
  {
    icon: Mail,
    title: "Email Us",
    text: "Sajidlulu256@gmail.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    text: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappMessage = `
Hello EZIN ZAHAN AUTO SPARE PARTS TRADING LLC,

I would like to contact you regarding an enquiry.

━━━━━━━━━━━━━━━━━━
CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

Subject: ${formData.subject}

Message:
${formData.message}

━━━━━━━━━━━━━━━━━━
Sent from EZIN ZAHAN AUTO SPARE PARTS TRADING LLC Website
━━━━━━━━━━━━━━━━━━
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-slate-200
          bg-[#e6f7ff]
          px-6
          py-20
        "
      >
        {/* Background decoration */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-blue-200/50
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-24
            left-10
            h-64
            w-64
            rounded-full
            bg-sky-100/70
            blur-3xl
          "
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0084D1]">
            Get In Touch
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">
            We're Here to{" "}
            <span className="text-[#0084D1]">Help</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Have a question about an auto part, compatibility, pricing, or your
            order? Contact EZIN ZAHAN AUTO SPARE PARTS TRADING LLC and we'll be happy to assist
            you.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ====================================================== */}

      <section className="relative overflow-hidden px-6 py-16">
        {/* Background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            top-20
            h-96
            w-96
            rounded-full
            bg-blue-100/60
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-40
            bottom-0
            h-96
            w-96
            rounded-full
            bg-sky-100/70
            blur-3xl
          "
        />

        {/* =================================================
            MAIN CONTAINER

            Desktop:
            Left  = 50%
            Right = 50%

            This makes both sections exactly the same width.
        ================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            max-w-6xl
            items-stretch
            gap-8
            lg:grid-cols-2
            lg:gap-10
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="flex h-full w-full flex-col">
            {/* Heading */}

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0084D1]">
                Contact Information
              </p>

              <h2 className="mt-2 text-3xl font-black leading-tight text-slate-900">
                Let's Talk About Your Vehicle
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-500">
                Our team is available to help you find the right automotive
                products and provide support whenever you need it.
              </p>
            </div>

            {/* Contact Cards */}

            <div className="mt-8 space-y-5">
              {CONTACT_INFO.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      flex
                      w-full
                      gap-4
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#0084D1]/30
                      hover:shadow-lg
                    "
                  >
                    {/* Icon */}

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#0084D1]/10
                      "
                    >
                      <Icon
                        size={21}
                        className="text-[#0084D1]"
                      />
                    </div>

                    {/* Text */}

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp */}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#0084D1]
                px-5
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-[#0084D1]/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#006FAF]
                hover:shadow-xl
                active:scale-[0.98]
              "
            >
              <MessageCircle size={20} />
              Chat With Us
            </a>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex h-full w-full">
            <div
              className="
                flex
                w-full
                flex-col
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-xl
                shadow-sky-900/5
                sm:p-8
              "
            >
              {/* Form Header */}

              <div className="mb-7">
                <h2 className="text-2xl font-black text-slate-900">
                  Send Us a Message
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in the form below and send your enquiry directly to
                  WhatsApp.
                </p>
              </div>

              {/* Success */}

              {submitted && (
                <div
                  className="
                    mb-6
                    rounded-lg
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-green-700
                  "
                >
                  Your message has been prepared and sent to WhatsApp
                  successfully.
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* =================================================
                      NAME
                  ================================================== */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#0084D1]
                        focus:ring-4
                        focus:ring-[#0084D1]/10
                      "
                    />
                  </div>

                  {/* =================================================
                      EMAIL
                  ================================================== */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Sajidlulu256@gmail.com"
                      required
                      className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#0084D1]
                        focus:ring-4
                        focus:ring-[#0084D1]/10
                      "
                    />
                  </div>

                  {/* =================================================
                      PHONE
                  ================================================== */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+971 56 870 6629"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#0084D1]
                        focus:ring-4
                        focus:ring-[#0084D1]/10
                      "
                    />
                  </div>

                  {/* =================================================
                      SUBJECT
                  ================================================== */}

                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Subject *
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#0084D1]
                        focus:ring-4
                        focus:ring-[#0084D1]/10
                      "
                    />
                  </div>

                  {/* =================================================
                      MESSAGE
                  ================================================== */}

                  <div className="sm:col-span-2">
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Message *
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us what you need help with..."
                      required
                      className="
                        w-full
                        resize-y
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-[#0084D1]
                        focus:ring-4
                        focus:ring-[#0084D1]/10
                      "
                    />
                  </div>

                  {/* =================================================
                      SUBMIT
                  ================================================== */}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#0084D1]
                        px-6
                        py-3.5
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-[#0084D1]/20
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-[#006FAF]
                        hover:shadow-xl
                        active:scale-[0.99]
                      "
                    >
                      <MessageCircle size={18} />
                      Send Message on WhatsApp
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="px-6 pb-16">
        <div
          className="
            mx-auto
            max-w-6xl
            overflow-hidden
            rounded-2xl
            bg-[#0084D1]
            px-6
            py-12
            text-center
            text-white
            shadow-xl
            shadow-[#0084D1]/20
            sm:px-12
          "
        >
          <h2 className="text-2xl font-black sm:text-3xl">
            Need an Auto Part Quickly?
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-blue-50
              sm:text-base
            "
          >
            Contact our team today for product availability, compatibility
            information, or assistance with your automotive requirements.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {/* Call */}

            <a
              href="tel:+971568706629"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-white
                px-6
                py-3
                font-semibold
                text-[#0084D1]
                transition
                hover:bg-blue-50
              "
            >
              <Phone size={18} />
              Call Us
            </a>

            {/* WhatsApp */}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-white/50
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-white/10
              "
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>

            {/* Email */}

            <a
              href="mailto:Sajidlulu256@gmail.com"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-white/50
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-white/10
              "
            >
              <Mail size={18} />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}