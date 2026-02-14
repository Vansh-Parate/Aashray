"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Key } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { cn } from "@/lib/utils/cn";

export function Hero() {
  const { ref: leftRef, isVisible: leftVisible } = useRevealOnScroll();
  const { ref: rightRef, isVisible: rightVisible } = useRevealOnScroll();

  return (
    <section className="relative min-h-screen pt-24 pb-12 lg:pt-32 lg:pb-24 flex items-center overflow-hidden gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
        <div
          ref={leftRef}
          className={cn(
            "z-10 transition-all duration-800",
            leftVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary/20 text-xs font-medium text-text/70 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            Trusted by 10,000+ students
          </div>

          <h1 className="font-accent text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.1] text-text mb-6">
            Find Your Safe <br />
            <span className="text-primary/90">Haven Away</span> <br />
            From Home
          </h1>

          <p className="text-lg md:text-xl text-text/60 max-w-lg leading-relaxed mb-10">
            Verified housing. Perfect roommates. Peace of mind. The premium marketplace for student
            living.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup?role=student"
              className="px-8 py-4 bg-primary text-white rounded-2xl font-medium text-sm hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <GraduationCap className="h-5 w-5" />
              I&apos;m a Student
            </Link>
            <Link
              href="/signup?role=warden"
              className="px-8 py-4 bg-transparent border border-text/10 text-text rounded-2xl font-medium text-sm hover:bg-surface transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Key className="h-5 w-5" />
              I&apos;m an Owner
            </Link>
          </div>
        </div>

        <div
          ref={rightRef}
          className={cn(
            "relative h-[600px] w-full perspective-1000 transition-all duration-800",
            rightVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary/20 to-sage/20 rounded-full blur-3xl -z-10" />

          <div className="absolute top-10 right-0 sm:right-10 w-80 sm:w-96 bg-white rounded-3xl p-3 shadow-2xl shadow-primary/10 animate-float z-20 border border-white/50">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern Apartment"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 320px, 384px"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                ₹15k/mo
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-text">Sunny Side Loft</h3>
                <div className="flex gap-0.5 text-primary text-xs">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
