import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    AlertCircle,
    ShieldCheck,
    ArrowLeft,
    Sparkles,
} from "lucide-react";
import logo from "../assets/logo.png";
import { isAuthenticated } from "../components/ProtectedRoute";

const resolveApiBaseUrl = () => {
    if (import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
    }
    if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1")
    ) {
        return "http://localhost:5000";
    }
    return "https://autosparts.onrender.com";
};

const API_BASE_URL = resolveApiBaseUrl();

// 14 animated particle definitions with pre-computed positions and delays
const PARTICLES = [
    { left: "10%", size: 3, duration: 12, delay: 0, opacity: 0.6 },
    { left: "22%", size: 4, duration: 16, delay: 2, opacity: 0.5 },
    { left: "35%", size: 2, duration: 10, delay: 4, opacity: 0.7 },
    { left: "48%", size: 5, duration: 18, delay: 1, opacity: 0.4 },
    { left: "60%", size: 3, duration: 14, delay: 5, opacity: 0.6 },
    { left: "72%", size: 4, duration: 13, delay: 3, opacity: 0.5 },
    { left: "85%", size: 2, duration: 11, delay: 6, opacity: 0.8 },
    { left: "15%", size: 4, duration: 15, delay: 7, opacity: 0.4 },
    { left: "28%", size: 2, duration: 9, delay: 8, opacity: 0.7 },
    { left: "42%", size: 5, duration: 17, delay: 9, opacity: 0.5 },
    { left: "55%", size: 3, duration: 13, delay: 2.5, opacity: 0.6 },
    { left: "68%", size: 4, duration: 16, delay: 4.5, opacity: 0.4 },
    { left: "80%", size: 2, duration: 10, delay: 1.5, opacity: 0.8 },
    { left: "92%", size: 3, duration: 14, delay: 6.5, opacity: 0.5 },
];

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const from = location.state?.from?.pathname || "/seller";
            navigate(from, { replace: true });
        }
    }, [navigate, location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email: email.trim(),
                password,
            });

            if (response.data.success) {
                // Save JWT token and user info
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                // Redirect to intended page or seller dashboard
                const redirectPath = location.state?.from?.pathname || "/seller";
                navigate(redirectPath, { replace: true });
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to sign in. Please verify your credentials and connection."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden bg-[#060a12] text-slate-100">
            {/* =====================================================
          ANIMATED BACKGROUND STYLES
      ====================================================== */}
            <style>{`
        @keyframes floatOrb1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(50px, -40px, 0) scale(1.12);
          }
          66% {
            transform: translate3d(-35px, 35px, 0) scale(0.92);
          }
        }

        @keyframes floatOrb2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(-60px, 45px, 0) scale(1.15);
          }
          66% {
            transform: translate3d(40px, -30px, 0) scale(0.88);
          }
        }

        @keyframes floatOrb3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(0.95);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(35px, 25px, 0) scale(1.2);
            opacity: 0.65;
          }
        }

        @keyframes floatOrb4 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-30px, -30px, 0) scale(1.1);
          }
        }

        @keyframes particleRise {
          0% {
            transform: translate3d(0, 100vh, 0);
            opacity: 0;
          }
          15% {
            opacity: var(--p-opacity, 0.7);
          }
          85% {
            opacity: var(--p-opacity, 0.7);
          }
          100% {
            transform: translate3d(20px, -20vh, 0);
            opacity: 0;
          }
        }

        @keyframes gridDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 60px 60px;
          }
        }

        @keyframes beamSweep {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }
          20% {
            opacity: 0.75;
          }
          80% {
            opacity: 0.75;
          }
          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }
      `}</style>

            {/* =====================================================
          LAYER 1: ANIMATED GLOWING AURORA ORBS
      ====================================================== */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Deep Blue Primary Glow */}
                <div
                    className="absolute -top-[15%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/25 blur-[130px]"
                    style={{ animation: "floatOrb1 18s ease-in-out infinite" }}
                />

                {/* Indigo / Purple Secondary Glow */}
                <div
                    className="absolute -bottom-[20%] -right-[10%] w-[650px] h-[650px] rounded-full bg-indigo-600/20 blur-[140px]"
                    style={{ animation: "floatOrb2 22s ease-in-out infinite" }}
                />

                {/* Cyan Accent Center Glow */}
                <div
                    className="absolute top-[35%] right-[5%] w-[450px] h-[450px] rounded-full bg-cyan-500/15 blur-[110px]"
                    style={{ animation: "floatOrb3 15s ease-in-out infinite" }}
                />

                {/* Sky Blue Bottom Accent */}
                <div
                    className="absolute bottom-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-sky-500/15 blur-[100px]"
                    style={{ animation: "floatOrb4 16s ease-in-out infinite" }}
                />
            </div>

            {/* =====================================================
          LAYER 2: AUTOMOTIVE TECH BLUEPRINT GRID
      ====================================================== */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-25"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.12) 1px, transparent 1px)
          `,
                    backgroundSize: "48px 48px",
                    animation: "gridDrift 35s linear infinite",
                }}
            />

            {/* Subtle Radial Vignette to keep focus on center */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 30%, #060a12 85%)",
                }}
            />

            {/* =====================================================
          LAYER 3: HORIZONTAL SPEED LIGHT BEAMS
      ====================================================== */}
            <div className="absolute inset-x-0 top-[22%] h-[1px] pointer-events-none z-0 overflow-hidden">
                <div
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                    style={{ animation: "beamSweep 9s ease-in-out infinite" }}
                />
            </div>

            <div className="absolute inset-x-0 bottom-[28%] h-[1px] pointer-events-none z-0 overflow-hidden">
                <div
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                    style={{ animation: "beamSweep 13s ease-in-out infinite 3.5s" }}
                />
            </div>

            {/* =====================================================
          LAYER 4: FLOATING PARTICLES / BOKEH SPARKS
      ====================================================== */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {PARTICLES.map((p, idx) => (
                    <div
                        key={idx}
                        className="absolute bottom-0 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)]"
                        style={{
                            left: p.left,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            "--p-opacity": p.opacity,
                            animation: `particleRise ${p.duration}s linear infinite`,
                            animationDelay: `${p.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* =====================================================
          LAYER 5: FOREGROUND CONTENT & LOGIN CARD
      ====================================================== */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                {/* Back to storefront link */}
                <div className="w-full mb-4 flex justify-between items-center px-1">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={15} />
                        Back to Storefront
                    </Link>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400/80">
                        <Sparkles size={13} />
                        Ezin Zahan Portal
                    </span>
                </div>

                {/* Login Card with ambient glow backdrop */}
                <div className="relative w-full group">
                    {/* Ambient rim glow behind the card */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-cyan-500/30 blur-xl opacity-60 group-hover:opacity-85 transition duration-700 -z-10" />

                    {/* Card Body */}
                    <div className="bg-white/98 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/20 overflow-hidden text-slate-900">
                        {/* Header */}
                        <div className="bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] px-8 pt-8 pb-7 text-center border-b border-white/10 relative">
                            <div className="flex justify-center mb-3">
                                <img
                                    src={logo}
                                    alt="Ezin Zahan Spare Parts"
                                    className="h-14 w-auto object-contain drop-shadow"
                                />
                            </div>

                            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/25 shadow-sm">
                                <ShieldCheck size={14} />
                                Authorized Seller Portal
                            </div>
                        </div>

                        {/* Form Area */}
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                                    Seller Sign In
                                </h2>
                                <p className="text-xs font-medium text-slate-500 mt-1">
                                    Enter your credentials to manage store inventory and products.
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-red-700 animate-fadeIn">
                                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                                    <p className="text-xs font-semibold leading-relaxed">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter seller email"
                                            autoComplete="email"
                                            required
                                            className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={18}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            autoComplete="current-password"
                                            required
                                            className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={19} className="animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={19} />
                                            Sign In to Dashboard
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Security note */}
                            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Ezin Zahan Auto Spare Parts Trading LLC
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    Protected session &bull; Authorized personnel only
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
