"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Heart,
  X,
  Camera,
  Bell,
  BarChart3,
  CheckCircle2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  Home,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { cn } from "@/lib/utils/cn";

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useRevealOnScroll();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-32 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-32">
            <h2 className="font-accent text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-text mb-6">
              Everything you need
              <br />
              in one place
            </h2>
            <p className="text-xl text-secondary max-w-xl mx-auto">
              Powerful tools designed for students and owners.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {/* 1. SMART DISCOVERY (2x2) */}
          <Reveal delay={0.1} className="col-span-1 md:col-span-2 row-span-2">
            <div className="group relative bg-white rounded-[2.5rem] p-12 overflow-hidden border border-text/5 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(212,165,116,0.12)] flex flex-col justify-between h-[640px]">
              <div
                className="absolute inset-0 bg-[#F5F7FA] transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/map-light.png')",
                }}
              />
              <div className="absolute top-12 left-12 right-12 z-20">
                <div className="bg-white rounded-full shadow-lg border border-text/5 px-6 py-4 flex items-center gap-4 max-w-md">
                  <Search className="text-xl text-text/50" />
                  <div className="h-2 w-32 bg-surface rounded-full" />
                </div>
              </div>
              <div className="relative w-full h-[65%] mt-12 z-10 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-text text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                    ₹12k
                  </div>
                  <div className="w-2 h-2 bg-text rotate-45 mx-auto -mt-1" />
                </div>
                <div className="absolute top-[35%] right-[25%] group-hover:scale-110 transition-transform duration-300 delay-100">
                  <div className="bg-text text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                    ₹8.5k
                  </div>
                  <div className="w-2 h-2 bg-text rotate-45 mx-auto -mt-1" />
                </div>
                <div className="absolute top-[40%] left-[35%] w-72 bg-white rounded-2xl shadow-2xl border border-text/5 p-3 group-hover:-translate-y-4 transition-transform duration-500 cursor-pointer pointer-events-auto">
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3">
                    <Image
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80"
                      alt="Cozy Studio"
                      fill
                      className="object-cover"
                      sizes="288px"
                    />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold">
                      4.9 ★
                    </span>
                  </div>
                  <div className="px-1 mb-1">
                    <h4 className="font-bold text-lg text-text">Cozy Studio</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-primary">₹15,000</span>
                      <span className="text-[10px] bg-sage/10 text-sage px-2 py-1 rounded-md font-bold">
                        98% Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-20 mt-auto bg-white/50 backdrop-blur-sm -mx-12 -mb-12 p-12 border-t border-text/5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-text mb-2">Smart Discovery</h3>
                <p className="text-lg text-secondary">Find verified housing on an interactive map.</p>
              </div>
            </div>
          </Reveal>

          {/* 2. VIRTUAL TOURS (2x2) */}
          <Reveal delay={0.15} className="col-span-1 md:col-span-2 row-span-2">
            <div className="group relative bg-black rounded-[2.5rem] overflow-hidden border border-text/5 h-[640px]">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                <div className="relative w-28 h-28 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-md cursor-pointer group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <div className="absolute inset-0 border border-white/40 rounded-full animate-ping opacity-20" />
                  <span className="text-white text-6xl animate-spin-slow">360°</span>
                </div>
                <div className="flex gap-12 mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <ChevronLeft className="text-white/80 text-4xl" />
                  <ChevronRight className="text-white/80 text-4xl" />
                </div>
              </div>
              <div className="absolute top-10 left-10 right-10 flex justify-between items-start z-20">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live View
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-medium flex gap-2">
                  <Camera className="h-5 w-5" /> 4 of 12
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-12 z-20">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white mb-6 border border-white/10">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-2">Virtual Tours</h3>
                <p className="text-lg text-white/70">
                  Explore every corner from the comfort of home.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 3. ROOMMATE MATCHING (1x1) */}
          <Reveal delay={0.2} className="col-span-1">
            <div className="group relative bg-white rounded-[2.5rem] p-10 overflow-hidden border border-text/5 hover:border-terra/20 transition-all duration-500 hover:shadow-xl flex flex-col h-[500px]">
              <div className="relative flex-1 flex justify-center items-center mb-4 perspective-1000">
                <div className="absolute w-56 h-72 bg-white rounded-2xl border border-text/5 shadow-md scale-90 -rotate-6 translate-y-4 opacity-60" />
                <div className="absolute w-56 h-72 bg-white rounded-2xl border border-text/5 shadow-lg scale-95 rotate-3 translate-y-2 opacity-80" />
                <div className="relative w-56 h-72 bg-white rounded-2xl border border-text/5 shadow-2xl p-3 flex flex-col group-hover:-rotate-2 transition-transform duration-500">
                  <div
                    className="w-full h-40 rounded-xl mb-3 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')",
                    }}
                  />
                  <div className="px-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg text-text">Sarah, 21</span>
                      <span className="text-xs font-bold text-white bg-sage px-2 py-1 rounded-full">
                        98%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-lg bg-surface p-1 rounded">🧘‍♀️</span>
                      <span className="text-lg bg-surface p-1 rounded">📚</span>
                      <span className="text-lg bg-surface p-1 rounded">✨</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 flex gap-6 z-20">
                  <div className="w-14 h-14 rounded-full bg-white shadow-xl border border-red-100 text-red-400 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <X className="h-8 w-8" />
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white shadow-xl border border-green-100 text-green-500 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <Heart className="h-8 w-8 fill-current" />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <div className="w-12 h-12 rounded-xl bg-terra/10 flex items-center justify-center text-terra mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-text mb-2">Match</h3>
                <p className="text-base text-secondary">Swipe to find your vibe.</p>
              </div>
            </div>
          </Reveal>

          {/* 4. SAFETY FIRST (1x1) */}
          <Reveal delay={0.25} className="col-span-1">
            <div className="group relative bg-white rounded-[2.5rem] p-10 overflow-hidden border border-text/5 hover:border-sage/20 transition-all duration-500 hover:shadow-xl flex flex-col h-[500px]">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 group-hover:scale-105 transition-transform duration-500">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      className="text-sage drop-shadow-xl"
                      strokeDasharray="92, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-text">
                    <span className="text-6xl font-bold tracking-tighter">92</span>
                    <span className="text-xs uppercase tracking-widest font-bold opacity-40 mt-2">
                      Score
                    </span>
                  </div>
                </div>
                <div className="w-full space-y-3 mt-6 pl-4">
                  <div className="flex items-center gap-4 text-base text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center text-sage">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    Verified Owner
                  </div>
                  <div className="flex items-center gap-4 text-base text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                    <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center text-sage">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    CCTV Secured
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center text-sage mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-text mb-2">Safety First</h3>
                <p className="text-base text-secondary">Rigorous 50-point checks.</p>
              </div>
            </div>
          </Reveal>

          {/* 5. QUICK FILTERS (1x1) */}
          <Reveal delay={0.3} className="col-span-1">
            <div className="group relative bg-surface rounded-[2.5rem] p-10 overflow-hidden border border-text/5 hover:border-primary/20 transition-all duration-500 flex flex-col h-[500px]">
              <div className="flex-1 flex flex-col gap-4 items-center justify-center mb-6">
                <div className="w-full bg-white p-5 rounded-2xl border-2 border-primary shadow-lg flex items-center gap-4 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl">💰</span>
                  <span className="font-bold text-lg text-text">Under ₹10k</span>
                </div>
                <div className="w-full bg-white p-5 rounded-2xl border border-text/5 shadow-sm flex items-center gap-4 opacity-70 group-hover:scale-105 transition-transform duration-300 delay-75">
                  <span className="text-2xl">❄️</span>
                  <span className="font-bold text-lg text-text">AC Rooms</span>
                </div>
                <div className="w-full bg-white p-5 rounded-2xl border border-text/5 shadow-sm flex items-center gap-4 opacity-50 group-hover:scale-105 transition-transform duration-300 delay-150">
                  <span className="text-2xl">🚇</span>
                  <span className="font-bold text-lg text-text">Near Metro</span>
                </div>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-text mb-2">Quick Filters</h3>
                <p className="text-base text-secondary">Instant results for you.</p>
              </div>
            </div>
          </Reveal>

          {/* 6. LIVE UPDATES (1x1) */}
          <Reveal delay={0.35} className="col-span-1">
            <div className="group relative bg-white rounded-[2.5rem] p-10 overflow-hidden border border-text/5 hover:border-primary/20 transition-all duration-500 flex flex-col h-[500px]">
              <div className="absolute top-10 right-10">
                <div className="relative">
                  <Bell className="text-text text-4xl group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-pulse">
                    3
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4 mt-8">
                <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-lg flex items-center gap-4 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Rent Paid</p>
                    <p className="text-xs text-text/50">Just now</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-lg flex items-center gap-4 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">New Match</p>
                    <p className="text-xs text-text/50">2m ago</p>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-text/5 shadow-sm flex items-center gap-4 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Bed Free</p>
                    <p className="text-xs text-text/50">5m ago</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-text/5 flex items-center justify-center text-text mb-4">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-text mb-2">Live Updates</h3>
                <p className="text-base text-secondary">Never miss a thing.</p>
              </div>
            </div>
          </Reveal>

          {/* 7. OWNER DASHBOARD (3x1) */}
          <Reveal delay={0.4} className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="group relative bg-white rounded-[2.5rem] p-12 overflow-hidden border border-text/5 hover:border-text/10 transition-all duration-500 flex flex-col justify-between h-[420px]">
              <div className="absolute top-12 right-12 w-[65%] h-[85%] bg-surface/30 rounded-tl-3xl border-l border-t border-text/5 p-6 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-sm">
                    <div className="text-secondary text-xs font-medium mb-1">Total Beds</div>
                    <div className="text-2xl font-bold text-text">48</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-sm">
                    <div className="text-secondary text-xs font-medium mb-1">Occupancy</div>
                    <div className="text-2xl font-bold text-sage">92%</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-sm">
                    <div className="text-secondary text-xs font-medium mb-1">Available</div>
                    <div className="text-2xl font-bold text-terra">4</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-sm">
                    <div className="text-secondary text-xs font-medium mb-1">Revenue</div>
                    <div className="text-2xl font-bold text-text">₹4.2L</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white p-4 rounded-2xl border border-text/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-sage" />
                      <span className="text-xs font-bold uppercase tracking-wide text-secondary">
                        Occupancy Grid
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "aspect-square rounded group-hover:bg-sage transition-colors",
                            i === 3 || i === 9 ? "bg-red-300" : "bg-sage/80"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-text/5">
                      <span className="text-xs font-medium pl-2">Room 101</span>
                      <span className="text-xs font-bold text-sage bg-sage/10 px-2 py-1 rounded">
                        Paid
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-text/5">
                      <span className="text-xs font-medium pl-2">Room 102</span>
                      <span className="text-xs font-bold text-terra bg-terra/10 px-2 py-1 rounded">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-[30%]">
                <div className="w-14 h-14 rounded-2xl bg-text text-white flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-text mb-3">
                  Owner Dashboard
                </h3>
                <p className="text-lg text-secondary">
                  Manage property, rent, and tenants in one view.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 8. INSTANT BOOKING (1x1) */}
          <Reveal delay={0.45} className="col-span-1">
            <div className="group relative bg-sage/10 rounded-[2.5rem] p-10 overflow-hidden border border-sage/20 hover:border-sage/40 transition-all duration-500 flex flex-col items-center text-center justify-between h-[420px]">
              <div className="mt-8 relative">
                <div className="w-32 h-32 rounded-full border-4 border-sage/30 border-t-sage flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <CheckCircle2 className="w-16 h-16 text-sage" />
                </div>
                <div className="absolute -right-2 -top-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-yellow-500 shadow-md animate-bounce">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="mt-4 font-bold text-2xl text-sage">Booked!</div>
              </div>
              <ul className="w-full text-left space-y-2 mt-4 pl-8 list-disc">
                <li className="text-sm text-secondary">View listing</li>
                <li className="text-sm text-secondary">Choose bed</li>
                <li className="text-sm text-secondary">Confirm & Pay</li>
              </ul>
              <div className="mt-2 w-full text-left">
                <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-white mb-4 shadow-lg shadow-sage/30">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-text mb-2">Instant Book</h3>
                <p className="text-base text-secondary">Reserve in seconds.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
