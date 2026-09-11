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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-[#070b14] flex flex-col items-center justify-center px-4 py-8 relative">
            {/* Back to storefront link */}
            <div className="w-full max-w-md mb-4 flex justify-between items-center">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={15} />
                    Back to Storefront
                </Link>
            </div>

            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-b from-[#0e1626] to-[#0a0f1d] px-8 pt-8 pb-7 text-center border-b border-white/10">
                        <div className="flex justify-center mb-3">
                            <img
                                src={logo}
                                alt="Ezin Zahan Spare Parts"
                                className="h-14 w-auto object-contain drop-shadow"
                            />
                        </div>

                        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
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
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
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
                                className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
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
    );
};

export default Login;
