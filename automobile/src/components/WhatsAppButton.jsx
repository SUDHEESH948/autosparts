import whatsappIcon from "../assets/gemini-svg (1).svg";

const WHATSAPP_NUMBER = "971568706629";

export default function WhatsAppButton() {
    const message = `Hello ,
I am contacting EZIN ZAHAN AUTO SPARE PARTS TRADING LLC regarding an enquiry about spare parts. 
Please provide more details. Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with EZIN ZAHAN AUTO SPARE PARTS on WhatsApp"
            className="
        fixed
        bottom-6
        right-6
        z-[9999]
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-white
        shadow-xl
        ring-1
        ring-slate-200
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-110
        hover:shadow-2xl
        active:scale-95
        sm:bottom-8
        sm:right-8
      "
        >
            <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="h-10 w-10 object-contain"
            />

            {/* Online indicator */}
            <span
                className="
          absolute
          right-0
          top-0
          h-4
          w-4
          rounded-full
          border-2
          border-white
          bg-green-500
        "
            />
        </a>
    );
}