import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Zap,
  X,
  Menu,
  ChevronRight,
  Lock,
  Activity,
  Wifi,
} from "lucide-react";

const HERO_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

const StreamLanding = () => {
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-[#23b5b5]/30">
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#23b5b5] text-black flex items-center justify-center rounded-xl font-black tracking-tight text-xs shadow-lg shadow-[#23b5b5]/40">
            ST
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold tracking-[0.22em] text-[10px] uppercase text-white/70">
              Stream
            </span>
            <span className="text-[10px] text-white/40 tracking-wide">
              Ultra-low latency live engine
            </span>
          </div>
        </div>


      </nav>

      {/* --- HERO --- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-60 scale-105"
          />
          {/* Teal-tinted overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(35,181,181,0.35),_transparent_55%)]" />
          {/* Noise */}
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-4">
          {/* Small pill above title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              <Wifi className="h-3 w-3 text-[#23b5b5]" />
              Live Stream Infrastructure
            </div>
          </motion.div>

          {/* Card */}
          <div className="text-center space-y-6 max-w-xl mx-auto backdrop-blur-xl p-7 rounded-3xl border border-white/8 bg-black/60 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-5xl font-semibold tracking-tight"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
                The stream layer
              </span>
              <span className="mt-1 block text-transparent bg-clip-text bg-gradient-to-b from-[#23b5b5] to-[#23b5b5]/60">
                for your product.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm text-white/60 leading-relaxed"
            >
              Stream turns any app into a live experience — with sub-second
              latency, built-in analytics, and a drop-in SDK. Private beta is
              opening soon.
            </motion.p>

            {/* Input + Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative w-full">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email for beta access"
                  className="w-full bg-black/70 border border-white/10 rounded-full py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#23b5b5] focus:ring-1 focus:ring-[#23b5b5] transition-all placeholder:text-white/40"
                />
              </div>
              <button className="w-full sm:w-auto whitespace-nowrap bg-[#23b5b5] text-black font-semibold text-sm px-7 py-3 rounded-full hover:bg-[#1da1a1] active:bg-[#178888] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#23b5b5]/40">
                Join Waitlist <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>


          </div>


        </div>
      </section>
    </div>
  );
};

export default StreamLanding;
